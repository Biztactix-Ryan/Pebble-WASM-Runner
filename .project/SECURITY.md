# Pebble WASM Runner — Security

## Authentication

Not applicable — this is a client-side-only application with no user accounts or server.

## Authorization

Not applicable — no multi-user access control needed.

## Data Protection

### Client-Side Only

- All processing happens in the browser — no data leaves the user's machine
- `.pbw` files are read locally via the File API
- No uploads to any server
- No cookies, local storage, or persistent tracking

### PBW File Handling

- Files are read into memory, processed, and discarded after install
- No file contents are transmitted anywhere
- Binary data flows only from JS → WASM emulator (same browser context)

## API Security

No APIs — the application has no server-side component.

### CORS / CSP

When hosted, standard static site headers apply:
- Content-Security-Policy should allow `wasm-eval` for WebAssembly execution
- No external API calls to protect

## Secrets Management

No secrets — there are no API keys, tokens, or credentials in this application.

## Known Risks & Mitigations

| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| Malicious .pbw could exploit PebbleOS bugs | Low | Runs in WASM sandbox — no host system access | Accepted |
| WASM sandbox escape | Very Low | Browser's WASM sandbox provides isolation | Accepted |
| Supply chain (JSZip dependency) | Low | Pin version, review updates, consider vendoring | Planned |
| XSS via crafted app metadata display | Low | Sanitize all metadata strings before DOM insertion | Planned |

## Incident Response

Minimal attack surface — static site with no backend. If compromised:
1. Redeploy clean static build
2. No user data at risk (nothing is stored)

---
*Last reviewed: 2026-04-07*
