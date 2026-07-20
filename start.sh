#!/bin/sh
set -e

# Fallback for Aiven deployment
if [ -z "$DATABASE_URL" ] && [ -n "$AIVEN_DATABASE_URL" ]; then
  export DATABASE_URL="$AIVEN_DATABASE_URL"
fi

echo "Applying latest schema..."
npx prisma db push --accept-data-loss

echo "Running latest seed..."
npx prisma db seed

echo "Starting application..."
exec node dist/src/main.js
