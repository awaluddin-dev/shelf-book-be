#!/bin/sh

echo "Applying Prisma migrations..."
# Try to run standard migration deployment
npx prisma migrate deploy

# Check the exit status of the previous command
if [ $? -ne 0 ]; then
  echo "Migration failed (likely P3005 or schema mismatch). Falling back to force sync..."
  # If migration deploy fails (e.g. because of P3005 "schema not empty" error), 
  # fallback to db push which syncs the schema directly without needing migration history.
  npx prisma db push --accept-data-loss
fi

echo "Starting application..."
exec node dist/src/main.js
