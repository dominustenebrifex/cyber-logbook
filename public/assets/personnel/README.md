# Personnel images

Add participant portraits to this folder when the Personnel Files section is populated.

- Prefer `AVIF` for source photos; provide a `WebP` fallback when using a `<picture>` element.
- Export portraits at `900 x 1200 px` (3:4) or larger at the same aspect ratio.
- Keep individual files below `250 KB` where possible.
- Use descriptive, stable names such as `agent-vex.avif` and `agent-vex.webp`.
- The UI already lazy-loads portraits, asynchronously decodes them, and supplies responsive display sizing.
