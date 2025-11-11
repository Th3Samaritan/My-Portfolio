My Digital Notebook: Field Notes

This document contains my personal checklists, code snippets, and notes. I maintain it here as a public resource and a personal quick-reference.

1. Pentesting Checklists

Web App (OWASP Top 10 Focus)

[ ] A01: Broken Access Control: Can I access admin URLs? Can I view/edit other users' data (IDOR)?

[ ] A02: Cryptographic Failures: Is sensitive data (passwords, PII) in transit (no HTTPS)? At rest (unhashed)?

[ ] A03: Injection: Test for SQLi (e.g., ' OR '1'='1'), NoSQLi, OS command (whoami), and XSS.

[ ] A04: Insecure Design: Is the business logic flawed? (e.g., unlimited "forgot password" attempts).

[ ] A05: Security Misconfiguration: Default credentials? Directory listing? Verbose error messages?

[ ] A06: Vulnerable/Outdated Components: Check framework/library versions (e.g., jQuery 1.8.0).

[ ] A07: Identification/Authentication Failures: Weak password policies? No brute-force protection?

[ ] A08: Software/Data Integrity Failures: Test for insecure deserialization.

[ ] A09: Security Logging/Monitoring Failures: Are my attacks even being logged?

[ ] A10: Server-Side Request Forgery (SSRF): Can I make the server request internal resources?

REST API

[ ] Broken Object Level Authorization (BOLA/IDOR): Can GET /api/v1/users/123 be changed to GET /api/v1/users/456?

[ ] Broken Function Level Authorization (BFLA): Can a regular user call POST /api/v1/admin/delete_user?

[ ] Broken Authentication: No auth? Weak API keys? JWT alg:none?

[ ] Mass Assignment: Can I POST a JSON object with {"isAdmin": true} and elevate my privileges?

[ ] Improper Data Filtering: Does the API return too much data (e.g., password hash in user object)?

[ ] Injection: SQLi, NoSQLi, Command Injection in URL parameters or JSON body.

[ ] Security Misconfiguration: Missing CORS headers? Access-Control-Allow-Origin: *?

[ ] No Rate Limiting: Can I brute-force a login endpoint or API key?

GraphQL API

[ ] Introspection: Is the introspection query enabled? (This gives me the entire API schema).

[ ] Authorization: Does the API perform authorization checks at the resolver level, not just the query level?

[ ] Injection: Test for SQLi/NoSQLi in query arguments.

[ ] Deeply Nested Queries: Can I DOS the server with a query 100 levels deep?

[ ] Batching Attacks: Can I send multiple queries in one request to bypass rate limiting?

[ ] Access Control: Can I access node types I shouldn't be able to? (e.g., query a user by ID).

2. Code Snippets

Python: Quick Local Web Server

A simple way to serve files from your current directory.

# For Python 3
import http.server
import socketserver

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()


Bash: Recon One-Liner

Find all subdomains for a target using subfinder and probe them for live web servers with httpx.

subfinder -d target.com -silent | httpx -silent -title -status-code -tech-detect


3. Library

Reading List

Cybersecurity Books

The Web Application Hacker's Handbook

Black Hat Python

Hacking: The Art of Exploitation

RTFM: Red Team Field Manual

Software Books

Clean Code: A Handbook of Agile Software Craftsmanship

Designing Data-Intensive Applications

The Pragmatic Programmer

Tech Books

The Phoenix Project

The Innovator's Dilemma

Fiction

The Davinci Code

Angels and Demon

The lost Symbol



Non-Fiction

Atomic Habits

Music & Artists

Classical 

Hip Hop 

Rap (J Cole)

4. Miscellany

Favorite Games

Grand Theft Auto

Call of Duty

God of War

Forza Horizon 4

Devil May Cry

Cyberpunk 2077

Elden Ring

Assasin Creed

Metal Gear Solid V

Favorite Quotes

"Which of the blessings of your lord, can you deny?"
- Suratul Rahman

"For Indeed After Hardship is ease, After Hardship is ease"
- Suratul Duha

"The more you know, the more you realize you don't know."
- Unknown

"It doesn't have to make sense to everyone as long as it makes sense to you. So don't think just do."
- Unknown

"You didn't Come this far, Just to come this far"
- Unknown

Bucket List (Things I'd Love to Do)

[ ] Contribute a major feature to an open-source project I use daily.

[ ] Visit The House of Medici in florence

[ ] Visit DefCon.

[ ] Develop an amazing material using codes.

[ ] work with Ethic41.

[ ] Travel to amazing places in the world.