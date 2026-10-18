import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { getStripeClient } from "./lib/stripe";
import { applyStripeWebhookEvent } from "./routes/payments";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res): Promise<void> => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(503).json({ error: "Stripe webhook is not configured." });
    return;
  }
  if (!signature) {
    res.status(400).json({ error: "Missing Stripe signature." });
    return;
  }
  try {
    const event = getStripeClient().webhooks.constructEvent(
      req.body as Buffer,
      Array.isArray(signature) ? signature[0] : signature,
      webhookSecret,
    );
    if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
      await applyStripeWebhookEvent(event);
    }
    res.json({ received: true });
  } catch (error) {
    req.log.warn({ err: error }, "Invalid Stripe webhook");
    res.status(400).json({ error: "Invalid Stripe webhook." });
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
