#!/usr/bin/env python3
"""
简单的代理服务器，解决CORS问题
运行后访问 http://localhost:8080
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import os

class ProxyHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            file_path = '.' + self.path
            with open(file_path, 'rb') as f:
                content = f.read()
            
            if self.path.endswith('.html'):
                content_type = 'text/html'
            elif self.path.endswith('.css'):
                content_type = 'text/css'
            elif self.path.endswith('.js'):
                content_type = 'application/javascript'
            else:
                content_type = 'application/octet-stream'
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'File not found')

    def do_POST(self):
        if self.path == '/api/chat':
            # 代理API请求
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # 转发到真实API
                req = urllib.request.Request(
                    'https://xingchen-api.xf-yun.com/workflow/v1/chat/completions',
                    data=post_data,
                    headers={
                        'Content-Type': 'application/json',
                        'Authorization': 'cb39d80bed4cd4906f3f61c3474eb83d',
                        'X-API-Secret': 'NjA4Nzc1OGI1NTY5M2I0ZDYxNTJmYjM2',
                        'X-Flow-ID': '7395016121178791938'
                    }
                )
                
                with urllib.request.urlopen(req) as response:
                    result = response.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(result)
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8080), ProxyHandler)
    print("代理服务器运行在 http://localhost:8080")
    print("按 Ctrl+C 停止服务器")
    server.serve_forever()