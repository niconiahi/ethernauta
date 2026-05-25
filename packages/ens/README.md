[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/ens&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/ens&treeshake=[*])

## Philosophy

This module ships ENSIP-15 name normalization implemented from scratch against the upstream specifications:

- [Unicode Standard Annex #15](https://www.unicode.org/reports/tr15/) (NFC / NFD)
- [ENSIP-15](https://docs.ens.domains/ensip/15) (Normalization Standard)
- [Unicode UCD 16.0](https://www.unicode.org/Public/16.0.0/ucd/)

The data files under `src/data/` are derived from public upstream sources via `pnpm derive`. The derivation script downloads the Unicode UCD files and the ENS validation reference data, then emits readable TypeScript modules — no opaque blobs. Rerun `pnpm derive` when Unicode releases a new version or ENSIP-15 amends its rules.

## Status

| Phase | Status |
|-------|--------|
| 1a — data derivation infrastructure | shipped |
| 1b — NFC implementation | shipped — passes 19,965 / 19,965 Unicode vectors |
| 1c — ENSIP-15 validation | shipped — passes 98.54% of 38,614 ENS vectors |

The remaining 1.46% gap in 1c is whole-script confusable detection (`WHOLES` table). Confusable labels are accepted today instead of rejected — see the TODO at the top of `src/normalize.ts`.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### Normalize an ENS name for namehash

```ts
import { ens_normalize } from "@ethernauta/ens"

const canonical = ens_normalize("Vitalik.ETH") // "vitalik.eth"
```

### Beautify an ENS name for display

```ts
import { ens_beautify } from "@ethernauta/ens"

const display = ens_beautify("vitalik.eth")
```

`ens_beautify` returns the display form with FE0F variation selectors restored on emoji sequences.

### Raw Unicode normalisation

```ts
import { from_cps, nfc, nfd, to_cps } from "@ethernauta/ens"

const cps = to_cps("café")
const composed = from_cps(nfc(cps))
const decomposed = from_cps(nfd(cps))
```

`to_cps` / `from_cps` convert between a string and its codepoint array; `nfc` and `nfd` operate on codepoint arrays directly so callers can avoid round-tripping through strings.
