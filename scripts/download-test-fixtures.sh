#!/usr/bin/env bash
set -euo pipefail

FIXTURE_TAG="test-fixtures/v1"
FIXTURE_DIR="tests/fixtures"
REPO="osztenkurden/cs2parser"

if ls "$FIXTURE_DIR"/*.dem 1>/dev/null 2>&1; then
	echo "Demo fixtures already present in $FIXTURE_DIR"
	exit 0
fi

echo "Downloading test fixtures from GitHub Release: $FIXTURE_TAG"
gh release download "$FIXTURE_TAG" -p "*.dem" -D "$FIXTURE_DIR" --repo "$REPO"
echo "Done. Fixtures saved to $FIXTURE_DIR"
