# mirror_me_web

The download site for MirrorMe: a camera for iOS Simulators and Android emulators that sees the part of your Mac desktop under the device window.

Next.js (App Router) + Tailwind CSS, with:

- a draggable phone over a desktop whose screen is a true see-through window (`src/components/PeepholeScene.tsx`, React Three Fiber). Park it on the QR card and the "camera" reads it.
- the install steps, including the one-time `xattr` command (with a copy button) that lets the un-notarized app open
- the MirrorMe mark in liquid metal ([paper-design/shaders](https://github.com/paper-design/shaders), as in liquid-logo)
- a shader gradient behind the download section ([shadergradient](https://github.com/ruucm/shadergradient))
- a liquid glass nav (`src/components/LiquidGlass.tsx`, after [liquid-glass-js](https://github.com/dashersw/liquid-glass-js))

## Develop

```bash
npm install
npm run dev
```

## Ship a new app version

1. Build the DMG in the app repo: `scripts/build-app.sh` (writes `build/MirrorMe-X.Y.Z.dmg`).
2. Copy it into `public/downloads/` and delete the old one.
3. Update `release` in `src/lib/site.ts` (version, file, size, SHA-256 from `shasum -a 256`).

## Deploy

Import the repo in Vercel. The defaults work: framework Next.js, build `next build`, no environment variables.
