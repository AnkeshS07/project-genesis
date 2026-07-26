# Nginx placeholder (optional / future-ready) — Epic 00 / M10

# Not wired into Compose yet. Later epics may terminate TLS and route:

# / -> web:3000

# /api -> api:3001

# /docs -> api:3001

#

# Do not enable until a reverse-proxy milestone is approved.

# upstream web_upstream { server web:3000; }

# upstream api_upstream { server api:3001; }
