# Deploy Bianco with Coolify

This repository is a pnpm monorepo. Deploy it in Coolify using the **Docker Compose** build strategy and the repository's `docker-compose.yml` file. Set the base directory to the repository root.

The Compose stack builds two services:

- `web`: serves the website and sends `/api/*` requests to the API service through Nginx.
- `api`: runs the Node API on the internal container port `8080`.

In Coolify, add the public domain to the `web` service on internal port `80`. Do not publish the API service directly; Nginx routes API and Stripe webhook requests through the website domain.

## Required environment

Add these values in the Coolify application's environment-variable settings. Do not put secrets in Git:

- `DATABASE_URL`: PostgreSQL connection string. The database must already have this app's schema before the API starts.
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for the same Stripe mode/account as the server key.
- `STRIPE_SECRET_KEY`: Stripe secret key for that same mode/account.

For Stripe webhook verification, also set:

- `STRIPE_WEBHOOK_SECRET`: signing secret for `https://YOUR_DOMAIN/api/stripe/webhook`.

The frontend and API share one domain in this Compose setup, so leave `VITE_API_BASE_URL` and `CORS_ORIGIN` blank. The web container proxies `/api/*` to the API internally. The host supplies HTTPS and routes public traffic to `web:80`.

Stripe secret keys remain server-side. The publishable key is embedded in the frontend build, so changing it requires rebuilding/redeploying the web service.

If you are not ready to enable payments, the Stripe variables can remain empty; menu and other API-backed pages still require a working PostgreSQL database. For live payments, use live-mode Stripe keys only after setting up HTTPS and the webhook URL above.
