#!/usr/bin/env bash
# Fetch the EF consensus-spec-tests KZG vectors + the c-kzg-4844 mainnet
# trusted setup into packages/eip/__fixtures__/. Skip if already present.
#
# Usage:  pnpm --filter @ethernauta/eip kzg:fetch
set -euo pipefail

VERSION="${KZG_TESTS_VERSION:-v1.5.0}"
HERE="$(cd "$(dirname "$0")" && pwd)"
FIXTURES="$HERE/../__fixtures__"
mkdir -p "$FIXTURES"

if [ ! -f "$FIXTURES/trusted_setup.txt" ]; then
  echo "fetching c-kzg-4844 trusted_setup.txt..."
  curl -fsSL -o "$FIXTURES/trusted_setup.txt" \
    https://raw.githubusercontent.com/ethereum/c-kzg-4844/main/src/trusted_setup.txt
fi

if [ ! -d "$FIXTURES/tests/general/deneb/kzg" ]; then
  echo "fetching consensus-spec-tests $VERSION general.tar.gz..."
  TMP="$(mktemp -t kzg-vectors.XXXXXX.tar.gz)"
  curl -fsSL -o "$TMP" \
    "https://github.com/ethereum/consensus-spec-tests/releases/download/$VERSION/general.tar.gz"
  echo "extracting deneb kzg vectors..."
  tar -xzf "$TMP" -C "$FIXTURES" tests/general/deneb/kzg
  rm -f "$TMP"
fi

echo "fixtures ready at $FIXTURES"
