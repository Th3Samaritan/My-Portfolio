Python: Simple Web Server

A quick way to serve files from a directory.

# python3
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()


Bash: Subdomain Recon

Find subdomains using subfinder and httpx.

#!/bin/bash
# Usage: ./recon.sh example.com
DOMAIN=$1
subfinder -d $DOMAIN -silent | httpx -silent -title -status-code -content-length


Materials: Note on HDPE

High-Density Polyethylene (HDPE): Milk jugs, detergent bottles.

Recycling for 3D Printing: Must be thoroughly cleaned and dried.

Extrusion Temp: ~180-200°C (varies)

Problem: Significant warping without a heated bed (~100°C) and enclosure.