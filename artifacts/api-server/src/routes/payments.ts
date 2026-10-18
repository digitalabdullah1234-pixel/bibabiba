import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import {
  CreateOrderPaymentIntentBody,
  CreateOrderPaymentIntentResponse,
  VerifyOrderPaymentBody,
  VerifyOrderPaymentResponse,
} from "@workspace/api-zod";
import {
  db,
  menuCartItemsTable,
  menuCartsTable,
  menuItemsTable,
  ordersTable,
} from "@workspace/db";
import { getStripeClient } from "../lib/stripe";

const router: IRouter = Router();

router.post("/payments/intents", async (req, res): Promise<void> => {
  const parsed = CreateOrderPaymentIntentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order details." });
    return;
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).json({ error: "Stripe test mode is not configured." });
    return;
  }

  const details = parsed.data;
  if (details.fulfillment === "delivery" && !details.deliveryAddress?.trim()) {
    res.status(400).json({ error: "A delivery address is required." });
    return;
  }

  const [cart] = await db
    .select({ id: menuCartsTable.id })
    .from(menuCartsTable)
    .where(eq(menuCartsTable.id, details.cartId))
    .limit(1);
  if (!cart) {
    res.status(404).json({ error: "Cart not found." });
    return;
  }

  const rows = await db
    .select({
      quantity: menuCartItemsTable.quantity,
      item: {
        id: menuItemsTable.id,
        nameEn: menuItemsTable.nameEn,
        nameAr: menuItemsTable.nameAr,
        price: menuItemsTable.price,
        available: menuItemsTable.available,
      },
    })
    .from(menuCartItemsTable)
    .innerJoin(menuItemsTable, eq(menuCartItemsTable.menuItemId, menuItemsTable.id))
    .where(and(
      eq(menuCartItemsTable.cartId, details.cartId),
      eq(menuItemsTable.available, true),
    ));

  if (!rows.length) {
    res.status(400).json({ error: "Your cart is empty or its items are unavailable." });
    return;
  }

  const subtotalSar = rows.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const amountHalalas = Math.round(subtotalSar * 100);
  if (amountHalalas < 100) {
    res.status(400).json({ error: "The order total is below Stripe's minimum." });
    return;
  }

  const orderId = randomUUID();
  const items = rows.map(({ item, quantity }) => ({
    itemId: item.id,
    nameEn: item.nameEn,
    nameAr: item.nameAr,
    unitPriceSar: item.price,
    quantity,
  }));

  try {
    await db.insert(ordersTable).values({
      id: orderId,
      cartId: details.cartId,
      fulfillment: details.fulfillment,
      customerName: details.customerName.trim(),
      phone: details.phone.trim(),
      deliveryAddress: details.fulfillment === "delivery" ? details.deliveryAddress?.trim() ?? null : null,
      notes: details.notes?.trim() ?? "",
      items,
      subtotalHalalas: amountHalalas,
      currency: "sar",
      status: "pending",
    });

    const intent = await getStripeClient().paymentIntents.create({
      amount: amountHalalas,
      currency: "sar",
      automatic_payment_methods: { enabled: true },
      metadata: { order_id: orderId, cart_id: details.cartId },
      description: `Bianco ${details.fulfillment} order`,
    }, { idempotencyKey: orderId });

    if (!intent.client_secret) {
      await db.update(ordersTable).set({ status: "failed", updatedAt: new Date() }).where(eq(ordersTable.id, orderId));
      res.status(502).json({ error: "Stripe did not return a payment session." });
      return;
    }

    await db.update(ordersTable)
      .set({ paymentIntentId: intent.id, updatedAt: new Date() })
      .where(eq(ordersTable.id, orderId));

    res.status(201).json(CreateOrderPaymentIntentResponse.parse({
      orderId,
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret,
      amount: amountHalalas,
      currency: "sar",
    }));
  } catch (error) {
    req.log.error({ err: error, orderId }, "Unable to create Stripe payment intent");
    await db.update(ordersTable).set({ status: "failed", updatedAt: new Date() }).where(eq(ordersTable.id, orderId));
    res.status(502).json({ error: "Unable to start payment. Please try again." });
  }
});

router.post("/payments/verify", async (req, res): Promise<void> => {
  const parsed = VerifyOrderPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payment verification request." });
    return;
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).json({ error: "Stripe test mode is not configured." });
    return;
  }

  const [order] = await db.select().from(ordersTable)
    .where(and(eq(ordersTable.id, parsed.data.orderId), eq(ordersTable.paymentIntentId, parsed.data.paymentIntentId)))
    .limit(1);
  if (!order) {
    res.status(404).json({ error: "Order not found." });
    return;
  }

  try {
    const intent = await getStripeClient().paymentIntents.retrieve(order.paymentIntentId!);
    if (intent.metadata.order_id !== order.id || intent.amount !== order.subtotalHalalas || intent.currency !== "sar") {
      req.log.warn({ orderId: order.id, paymentIntentId: intent.id }, "Payment details do not match the order");
      res.status(400).json({ error: "Payment details do not match this order." });
      return;
    }

    const status = intent.status === "succeeded" ? "paid"
      : intent.status === "canceled" || intent.status === "requires_payment_method" ? "failed"
        : "processing";
    await db.update(ordersTable).set({ status, updatedAt: new Date() }).where(eq(ordersTable.id, order.id));
    res.json(VerifyOrderPaymentResponse.parse({ orderId: order.id, status }));
  } catch (error) {
    req.log.error({ err: error, orderId: order.id }, "Unable to verify Stripe payment");
    res.status(502).json({ error: "Unable to verify payment yet. Check again before retrying." });
  }
});

type StripeWebhookEvent = {
  type: string;
  data: { object: { id: string; amount: number; currency: string; metadata: Record<string, string> } };
};

export async function applyStripeWebhookEvent(event: StripeWebhookEvent): Promise<void> {
  if (event.type !== "payment_intent.succeeded" && event.type !== "payment_intent.payment_failed") return;
  const intent = event.data.object;
  const orderId = intent.metadata.order_id;
  if (!orderId) return;

  const [order] = await db.select({
    id: ordersTable.id,
    paymentIntentId: ordersTable.paymentIntentId,
    subtotalHalalas: ordersTable.subtotalHalalas,
  }).from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);
  if (
    !order ||
    order.paymentIntentId !== intent.id ||
    intent.amount !== order.subtotalHalalas ||
    intent.currency !== "sar"
  ) {
    return;
  }

  await db.update(ordersTable)
    .set({ status: event.type === "payment_intent.succeeded" ? "paid" : "failed", updatedAt: new Date() })
    .where(and(
      eq(ordersTable.id, orderId),
      eq(ordersTable.paymentIntentId, intent.id),
      inArray(ordersTable.status, ["pending", "processing", "failed"]),
    ));
}

export default router;
