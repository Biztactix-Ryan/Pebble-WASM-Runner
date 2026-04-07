#!/usr/bin/env python3
"""HTTPS dev server with COOP/COEP headers required for SharedArrayBuffer (Emscripten pthreads).
Use with a self-signed cert for non-localhost access."""

import http.server
import socketserver
import ssl
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8443
DIRECTORY = sys.argv[2] if len(sys.argv) > 2 else "."
CERTFILE = sys.argv[3] if len(sys.argv) > 3 else "/tmp/cert.pem"
KEYFILE = sys.argv[4] if len(sys.argv) > 4 else "/tmp/key.pem"


class COOPCOEPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()


class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


if __name__ == "__main__":
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(CERTFILE, KEYFILE)

    with ThreadedHTTPServer(("", PORT), COOPCOEPHandler) as httpd:
        httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
        print(f"Serving {DIRECTORY}/ at https://0.0.0.0:{PORT}")
        print("COOP/COEP headers enabled (SharedArrayBuffer support)")
        print(f"Using cert: {CERTFILE}, key: {KEYFILE}")
        httpd.serve_forever()
