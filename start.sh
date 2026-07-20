#!/bin/sh
echo "Applying latest schema..."
npx prisma db push
echo "Running latest seed..."
npx prisma db seed
echo "Starting application..."
exec node dist/src/main.js
