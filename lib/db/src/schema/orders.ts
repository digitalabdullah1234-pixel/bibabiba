import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type OrderLineSnapshot = {
  itemId: string;
  nameEn: string;
  nameAr: string;
  unitPriceSar: number;
  quantity: number;
};

export const ordersTable = pgTable("restaurant_orders", {
  id: uuid("id").primaryKey(),
  cartId: uuid("cart_id").notNull(),
  paymentIntentId: text("payment_intent_id").unique(),
  fulfillment: text("fulfillment").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  deliveryAddress: text("delivery_address"),
  notes: text("notes").notNull().default(""),
  items: jsonb("items").$type<OrderLineSnapshot[]>().notNull(),
  subtotalHalalas: integer("subtotal_halalas").notNull(),
  currency: text("currency").notNull().default("sar"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type RestaurantOrder = typeof ordersTable.$inferSelect;
export type InsertRestaurantOrder = typeof ordersTable.$inferInsert;
