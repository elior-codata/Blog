#!/usr/bin/env python3
"""
Simple HTTP server with image upload support.
Serves static files and handles POST /upload for image uploads.
Usage: python3 server.py [port]
"""

import os
import sys
import json
import uuid
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images')
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

class UploadHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload':
            self.handle_upload()
        else:
            self.send_error(404, 'Not Found')

    def handle_upload(self):
        content_type = self.headers.get('Content-Type', '')
        
        if 'multipart/form-data' not in content_type:
            self.send_json(400, {'error': 'Expected multipart/form-data'})
            return

        # Parse boundary
        boundary = None
        for part in content_type.split(';'):
            part = part.strip()
            if part.startswith('boundary='):
                boundary = part[len('boundary='):]
                break

        if not boundary:
            self.send_json(400, {'error': 'No boundary found'})
            return

        # Read body
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > MAX_FILE_SIZE:
            self.send_json(413, {'error': 'File too large (max 10MB)'})
            return

        body = self.rfile.read(content_length)

        # Parse multipart
        boundary_bytes = boundary.encode()
        parts = body.split(b'--' + boundary_bytes)

        file_data = None
        filename = None
        target_name = None  # optional custom filename from form

        for part in parts:
            if b'Content-Disposition' not in part:
                continue

            # Extract headers and body of this part
            try:
                header_end = part.index(b'\r\n\r\n')
            except ValueError:
                continue
            
            header_section = part[:header_end].decode('utf-8', errors='replace')
            part_body = part[header_end + 4:]
            
            # Remove trailing \r\n
            if part_body.endswith(b'\r\n'):
                part_body = part_body[:-2]

            # Check if this is the file field
            if 'name="image"' in header_section or 'name="file"' in header_section:
                file_data = part_body
                # Extract filename from Content-Disposition
                for line in header_section.split('\r\n'):
                    if 'filename="' in line:
                        start = line.index('filename="') + 10
                        end = line.index('"', start)
                        filename = line[start:end]
            
            # Check for optional target filename
            if 'name="filename"' in header_section:
                target_name = part_body.decode('utf-8', errors='replace').strip()

        if file_data is None:
            self.send_json(400, {'error': 'No file in request'})
            return

        # Determine final filename
        if target_name:
            safe_name = os.path.basename(target_name)
        elif filename:
            safe_name = os.path.basename(filename)
        else:
            safe_name = f'upload-{uuid.uuid4().hex[:8]}.jpg'

        # Validate extension
        _, ext = os.path.splitext(safe_name)
        ext = ext.lower()
        if ext not in ALLOWED_EXTENSIONS:
            self.send_json(400, {'error': f'File type {ext} not allowed. Use: {", ".join(ALLOWED_EXTENSIONS)}'})
            return

        # Ensure upload directory exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # If file exists, add a unique suffix
        filepath = os.path.join(UPLOAD_DIR, safe_name)
        if os.path.exists(filepath) and not target_name:
            name, ext = os.path.splitext(safe_name)
            safe_name = f'{name}-{uuid.uuid4().hex[:6]}{ext}'
            filepath = os.path.join(UPLOAD_DIR, safe_name)

        # Write file
        with open(filepath, 'wb') as f:
            f.write(file_data)

        # Return the URL path
        url_path = f'/images/{safe_name}'
        print(f'  Uploaded: {url_path} ({len(file_data)} bytes)')
        self.send_json(200, {'url': url_path, 'filename': safe_name, 'size': len(file_data)})

    def send_json(self, code, data):
        response = json.dumps(data).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def end_headers(self):
        # Add CORS headers to all responses
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    server = HTTPServer(('', port), UploadHandler)
    print(f'🚀 Server running at http://localhost:{port}')
    print(f'📁 Upload directory: {UPLOAD_DIR}')
    print(f'📷 Max file size: {MAX_FILE_SIZE // (1024*1024)}MB')
    print(f'   Allowed types: {", ".join(ALLOWED_EXTENSIONS)}')
    print()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
        server.server_close()


if __name__ == '__main__':
    main()
