#!/bin/bash

# Restart EventNest Application

echo "🔄 Restarting EventNest..."

# Check if using docker-compose or docker compose
if command -v docker-compose &> /dev/null; then
    docker-compose restart
else
    docker compose restart
fi

echo "✅ EventNest restarted!"
echo ""
echo "To view logs: ./scripts/logs.sh"
