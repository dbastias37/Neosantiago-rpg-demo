#!/usr/bin/env python3
"""Local-only preview. Does not create an HTML entry point in the repository."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
import argparse
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        if urlparse(self.path).path in ('/','/extensions/mensajeros/preview'):
            content=(ROOT/'extensions/mensajeros/preview.html.template').read_bytes()
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(content)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(content)
        else: super().do_GET()
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--port',type=int,default=8130);args=parser.parse_args()
print(f'Laboratorio local: http://127.0.0.1:{args.port}/',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
