import Stripe from "stripe";

let stripeClient: Stripe | undefined;
let cachedKey: string | undefined;

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe is not configured.");
  }
  if (!stripeClient || cachedKey !== secretKey) {
    stripeClient = new Stripe(secretKey);
    cachedKey = secretKey;
  }
  return stripeClient;
}
