---
name: PDF menu photo extraction
description: How to handle dish photography embedded in the Bianco menu PDF.
---

The Bianco menu PDF combines food photography with logos and decorative marks on each page. Selecting the largest embedded image is usually useful, but it can return a decorative asset on pages without a dish photo. Visually inspect the extracted images and provide a fallback image for any photo-less dish.

**Why:** A decorative image can pass file and dimension checks while rendering as a blank or ornament-only dish card.

**How to apply:** Keep extracted dish photos in the restaurant's public menu asset directory, and use a generated or separately sourced food photo when a PDF page does not contain a usable dish image.