#!/bin/bash

# Backend Build Information Script
# This script displays detailed build information after the main build process

set -e  # Exit on any error

echo "=== Build Information ==="

# Display environment variables
echo "Environment Variables:"
echo "--- CORS_ORIGIN ---"
if [ -n "$CORS_ORIGIN" ]; then
    echo "CORS_ORIGIN=$CORS_ORIGIN"
    echo "Parsed origins:"
    echo "$CORS_ORIGIN" | tr ',' '\n' | sed 's/^/- /'
else
    echo "CORS_ORIGIN is not set"
fi
echo "-------------------"

# Display current Prisma configuration
echo "Current Prisma Schema Configuration:"
echo "--- Prisma Schema Configuration ---"
grep -A 2 'datasource db' prisma/schema.prisma
echo "-----------------------------------"

# Display generated client schema
echo "Generated Prisma Client Schema:"
echo "--- Generated Prisma Client Schema ---"
grep -A 2 'datasource db' node_modules/.prisma/client/schema.prisma
echo "--------------------------------------"

echo "=== Build Information Displayed ==="