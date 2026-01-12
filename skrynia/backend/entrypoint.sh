#!/bin/sh
set -e

# Create uploads directory with proper permissions (as root)
mkdir -p /app/static/uploads
chmod -R 777 /app/static/uploads

# If running as root, switch to appuser for the main command
if [ "$(id -u)" = "0" ]; then
    # Use su to switch to appuser and execute the command
    exec su appuser -c "sh -c \"$*\""
else
    exec "$@"
fi

