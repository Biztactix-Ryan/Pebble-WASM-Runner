# Pebble WASM Runner — Vision

## Mission

Recreate the Pebble Developer Emulator + Install Tool entirely in the browser. No hardware, no server, no Python runtime — just open a webpage, upload a `.pbw`, click install, and the app runs.

## Why This Exists

Pebble watches are discontinued, but the developer and enthusiast community still builds apps. Currently running those apps requires either:
- Physical Pebble hardware (increasingly rare/broken)
- Desktop emulator tooling with complex Python dependencies

PWR eliminates both barriers. Anyone with a browser can run Pebble apps.

## End-State User Experience

1. Open webpage
2. Upload a `.pbw` file
3. Click "Install"
4. Watch the app launch in the emulator
5. Interact with the virtual Pebble watch

## What Success Looks Like

### Minimal Viable Product (First Milestone)
- Upload `.pbw` file in browser
- Parse the bundle and display app name/metadata
- Install a single app binary into the emulator
- App runs inside the WASM Pebble emulator

### Full Product
- Full install support: app binary + resources + worker
- Progress bar during install
- Error reporting with actionable messages
- Multiple app installs
- App uninstall support
- Metadata display (name, version, company, icon)
- List of installed apps

## Design Principles

- **Browser-native**: Everything runs client-side. No server calls during install.
- **Protocol-faithful**: We port the real Pebble install protocol, not a shortcut. This ensures compatibility with real `.pbw` files.
- **Reference-driven**: libpebble2 is the source of truth for protocol logic. We translate, not reinvent.
- **Progressive**: Ship the minimal version first, add resource/worker support second.

## Non-Goals (For Now)

- Phone companion app emulation
- Bluetooth protocol simulation
- App store browsing
- Cloud compilation
- Multi-platform watch support (focus on one Pebble model first)

---
*Last reviewed: 2026-04-07*
