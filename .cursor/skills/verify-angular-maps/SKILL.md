---
name: verify-angular-maps
description: Build the Angular Google Maps + three.js demo and verify the rendered app (real three.js WebGL canvas, agm-map element, boot) at mobile and desktop widths, recording the Google Maps API-key boundary honestly.
---
# Angular maps + 3D demo verification

## Launch
Node 22.12+, `npm ci --ignore-scripts --legacy-peer-deps` (required: @agm/core 1.1.0 declares Angular 6-8 peers against this Angular 15 app). Build: `npx ng build`, output at `dist/demo/`. Chrome at CHROME_PATH or /usr/bin/google-chrome.

## Doctor + Drive
`python3 .cursor/skills/verify-angular-maps/verify.py` (stdlib only) runs the real production build, serves dist/demo on an ephemeral loopback port, renders with headless Chrome (swiftshader WebGL) at 390 and 1365, and asserts: build green, three.js r148 canvas present with set dimensions (cubes from MockDataService render), `agm-map` element present, app-root booted with substantial DOM. Captures mobile.png/desktop.png/dom.html/build.log into .verification-evidence/angular-maps/ and exits 0 only at FAILURES=0.

## Evidence
build.log, mobile.png, desktop.png, dom.html, maps-boundary.json. Inspect the screenshots: the three.js scene (colored cubes on black) renders; the map panel stays blank without a key.

## Cleanup
Only the ephemeral http.server (terminated) and .verification-evidence output. dist/ is a build artifact.

## Known boundaries
Google Maps tiles/JS API need a real API key - app.module.ts ships `YOUR_PLACEHOLDER_API_KEY`, so the map panel renders blank; this is recorded in maps-boundary.json, not hidden. npm ci needs --legacy-peer-deps (@agm/core peer range). No map pan/zoom interaction proof, no CI, no hosted claim. Build fixed: src/tsconfig.app.json was missing while angular.json referenced it.
