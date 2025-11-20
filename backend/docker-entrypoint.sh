#!/bin/sh
set -e

echo "🚀 EventNest Backend Starting..."

# Wait longer for database
echo "⏳ Waiting for database to be ready..."
sleep 30

echo "🔄 Pushing database schema..."
npx prisma db push --accept-data-loss --skip-generate

echo "🎉 Starting EventNest Backend Server..."
echo "================================================"

# Start the Node.js application
exec node server.js
