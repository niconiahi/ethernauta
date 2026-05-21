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
| 1a — data derivation infrastructure | shipped |
| 1b — NFC implementation | shipped — passes 19,965/19,965 Unicode vectors |
| 1c — ENSIP-15 validation | shipped — passes 98.54% of 38,614 ENS vectors |

The remaining 1.46% gap in 1c is whole-script confusable
detection (`WHOLES` table) — see TODO at the top of
`src/normalize.ts`. Confusable labels are accepted today
instead of rejected.

## API

- `ens_normalize(name)` — canonical form for namehash
- `ens_beautify(name)` — display form with FE0F selectors
- `nfc(cps) / nfd(cps)` — raw Unicode normalisation
- `to_cps(s) / from_cps(cps)` — codepoint helpers
