# DEV DESIGN Asset Registry

This directory is reserved for generated cinematic assets used by the DEV DESIGN experience.

React components can reference these files with public URLs beginning with `/assets/`.
For example:

```ts
const aiFace = "/assets/hero/ai-face/face_front_awakened.png";
```

Use `asset-registry.json` as the stable map of asset slots. Entries marked `existing`
point to files currently present in this project. Entries marked `placeholder` reserve
future asset locations and should be replaced with generated PNG/WebP/AVIF/SVG files
when those assets are ready.

Do not move existing generated assets unless all references are updated together.

