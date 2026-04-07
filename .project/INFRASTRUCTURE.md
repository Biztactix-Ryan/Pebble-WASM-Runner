# Pebble WASM Runner — Infrastructure

## Environments

| Environment | URL | Purpose | Notes |
|------------|-----|---------|-------|
| Development | `localhost:8000` | Local dev/testing | Python HTTP server or any static file server |
| Production | TBD | Public hosted version | Static site — any CDN/hosting works |

## CI/CD

### Build Pipeline

1. `build_wasm.sh` compiles QEMU to WebAssembly via Emscripten
2. `scripts/patch_wasm.py` applies post-build patches to the WASM output
3. Output: static files (HTML + JS + WASM) ready to serve

### Deployment Process

Static site deployment — no server-side runtime:
- Build produces `index.html`, JS files, WASM binary, and PebbleOS firmware
- Deploy to any static hosting (GitHub Pages, Netlify, Cloudflare Pages, S3+CloudFront)

### Rollback Procedure

- Redeploy previous static build artifacts
- No database or server state to roll back

## Hosting & Services

- **Compute**: None — runs entirely in the user's browser
- **Storage**: None — no server-side persistence
- **CDN**: Any static hosting (GitHub Pages recommended for simplicity)
- **DNS**: TBD

The entire application is client-side. The "server" is just a file host.

## Monitoring & Alerting

Not applicable for MVP — no server to monitor. Future considerations:
- Browser error reporting (Sentry or similar)
- Usage analytics (optional)

## Environment Variables

None required. This is a purely static client-side application.

## Backup & Recovery

Not applicable — no server-side data. Source code is version controlled in git.

## Build Requirements

| Tool | Version | Purpose |
|------|---------|---------|
| Emscripten SDK | Latest | Compile QEMU C code to WebAssembly |
| Python 3 | 3.x | Build scripts, local dev server |
| Make / CMake | Standard | QEMU build system |

## Artifacts

| File | Description |
|------|-------------|
| `index.html` | Main entry point and UI |
| `*.js` | Emscripten glue code + installer logic |
| `*.wasm` | Compiled QEMU emulator |
| PebbleOS firmware | ROM image loaded by the emulator |

---
*Last reviewed: 2026-04-07*
