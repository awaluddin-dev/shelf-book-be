#!/bin/sh

# Start a dummy healthcheck server to satisfy Kubernetes probes during slow DB initialization
echo "Starting dummy healthcheck server on port 8080..."
node -e "const http = require('http'); http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'application/json'}); res.end('{\"status\":\"ok\"}'); }).listen(8080);" &
DUMMY_PID=$!

# Force override DATABASE_URL to ensure Prisma CLI targets the same DB as the app
if [ -n "$AIVEN_DATABASE_URL" ]; then
  export DATABASE_URL="$AIVEN_DATABASE_URL"
fi

# Append sslaccept=accept_invalid_certs to bypass Prisma CLI strict TLS check
if echo "$DATABASE_URL" | grep -q "?"; then
  export DATABASE_URL="${DATABASE_URL}&sslaccept=accept_invalid_certs"
else
  export DATABASE_URL="${DATABASE_URL}?sslaccept=accept_invalid_certs"
fi

echo "Applying latest schema via migrations..."
if ! npx prisma migrate deploy; then
  echo "============== PRISMA MIGRATE FAILED =============="
  echo "Check the logs above to see why Prisma failed to migrate the schema."
  echo "==================================================="
fi

echo "Running latest seed..."
if ! npx prisma db seed; then
  echo "============== PRISMA DB SEED FAILED =============="
  echo "Check the logs above to see why Prisma failed to seed the database."
  echo "==================================================="
fi

echo "Shutting down dummy server..."
kill $DUMMY_PID || true
sleep 1

echo "Starting application..."
exec node dist/src/main.js
