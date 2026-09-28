---
name: PDF menu photo extraction
description: How to handle dish photography embedded in the Bianco menu PDF.
---

The Bianco menu PDF combines food photography with logos and decorative marks on each page. Selecting the largest embedded image is usually useful, but it can return a decorative asset on pages without a dish photo. Visually inspect the extracted images and map a photo only to the dish it actually depicts. If there is no confirmed match, use a clearly non-photographic placeholder or source a correct image; do not fill the slot with an unrelated dish or restaurant interior.

Generated background removal can return a PNG with a checkerboard rendered into the image instead of transparency. Check the alpha channel and composite cutouts on both light and dark surfaces; if the checkerboard is baked in, reprocess from a clean source or use a uniform background for keying.

**Why:** A decorative image can pass file and dimension checks while rendering as a blank or ornament-only dish card. A fake transparency pattern can also damage the food itself when removed, and either issue undermines trust in the menu.

**How to apply:** Keep verified dish photos in the restaurant's public menu asset directory. Check the dish-to-photo mapping visually and verify actual transparency; when no suitable asset exists, keep the menu honest with a distinct placeholder until a correct food photo is available.