#!/bin/bash
set -euo pipefail

ENVIRONMENT="${1:-prod}"
echo "[deploy] Starting deployment for qr (env: $ENVIRONMENT)"

# Build and deploy with docker compose
echo "[deploy] Building and starting container..."
docker compose build --no-cache
docker compose up -d

echo "[deploy] Waiting for container to be healthy..."
sleep 3

# Verify container is running
if docker compose ps | grep -q "qr.*running"; then
    echo "[deploy] Container is running"
    docker compose ps
else
    echo "[deploy] ERROR: Container failed to start"
    docker compose logs --tail=50
    exit 1
fi

echo "[deploy] Deployment complete!"
