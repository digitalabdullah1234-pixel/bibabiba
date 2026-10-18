---
name: Independent checkout hosting
description: Bianco's custom ordering and payment flow must work when production hosting is outside Replit.
---

Build Bianco's order page and payment backend as a portable part of its own website. Do not make production checkout depend on Replit-hosted commerce or deployment integrations; configure provider credentials and webhooks on the user's chosen production host.

**Why:** The user wants to build the website in Replit and publish it elsewhere.

**How to apply:** Keep the ordering page, API, and payment integration deployable on a separately managed host, using environment configuration rather than Replit-only runtime services.
