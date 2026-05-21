# @ethernauta/ens

ENSIP-15 name normalization, implemented from scratch
against the upstream specs:

- Unicode Standard Annex #15 (NFC/NFD)
- ENSIP-15 (Normalization Standard)
- Unicode UCD (16.0)

The data files under `src/data/` are derived from public
upstream sources via `pnpm derive`. The derivation script
downloads:

- Unicode UCD files from `unicode.org/Public/16.0.0/ucd/`
- ENS validation spec from the ENS Foundation reference
  data set

…and emits readable TypeScript modules (no opaque blobs).
Rerun `pnpm derive` when Unicode releases a new version
or ENSIP-15 amends its rules.

## Status

| Phase | Status |
|-------|--------|
| 1a — data derivation infrastructure | in progress |
| 1b — NFC implementation | pending |
| 1c — ENSIP-15 validation | pending |
