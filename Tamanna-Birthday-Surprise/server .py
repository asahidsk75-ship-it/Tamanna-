import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

port = int(os.environ.get("PORT", 10000))

server = ThreadingHTTPServer(("0.0.0.0", port), SimpleHTTPRequestHandler)
print(f"Server running on port {port}")
server.serve_forever()
