# mirror_me_web

The download site for [MirrorMe](https://github.com/hexhad/mirror-me): a camera for iOS Simulators and Android emulators that sees the part of your Mac desktop under the device window.

Next.js (App Router) + Tailwind CSS, with:

- a draggable phone over a desktop whose screen is a true see-through window (`src/components/PeepholeScene.tsx`, React Three Fiber). Park it on the QR card and the "camera" reads it.
- the MirrorMe mark in liquid metal ([paper-design/shaders](https://github.com/paper-design/shaders), as in liquid-logo)
- a shader gradient behind the download section ([shadergradient](https://github.com/ruucm/shadergradient))
- a liquid glass nav (`src/components/LiquidGlass.tsx`, after [liquid-glass-js](https://github.com/dashersw/liquid-glass-js))

## Develop

```bash
npm install
npm run dev
```

## Downloads

The download buttons point at `https://github.com/hexhad/mirror-me/releases/latest/download/MirrorMe.dmg`, so every
release of the app should upload an unversioned `MirrorMe.dmg` asset (alongside `MirrorMe-X.Y.Z.dmg`).
After a release, update `release` in `src/lib/site.ts` (version, size, SHA-256).

## Deploy

Import the repo in Vercel. The defaults work: framework Next.js, build `next build`, no environment variables.
