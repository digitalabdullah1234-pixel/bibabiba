---
name: Restaurant photo hosting
description: Bianco hero imagery should use stable, verified local restaurant photography.
---

Use a verified local Bianco photo for the hero instead of depending on a remote Google Maps listing-image URL.

**Why:** The existing listing-image URL returned HTTP 403 during the hero redesign, while a high-resolution restaurant photo was already available locally.

**How to apply:** Keep the chosen real restaurant image under the web artifact's public assets, reference it with the app base URL, and check that the image is served and visible at desktop and mobile sizes.
