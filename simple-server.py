#!/usr/bin/env python3
import http.server
import socketserver
from http.server import SimpleHTTPRequestHandler

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

PORT = 8080
with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
    print(f"Server at http://localhost:{PORT}")
    httpd.serve_forever()