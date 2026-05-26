[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/ens&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/ens&treeshake=[*])

## Philosophy

This module ships ENS resolution orchestration — `addr` / `name` / `text` / `avatar` reverse and forward lookups — plus ENSIP-15 name normalisation implemented from scratch against the upstream specifications:

- [Unicode Standard Annex #15](https://www.unicode.org/reports/tr15/) (NFC / NFD)
- [ENSIP-15](https://docs.ens.domains/ensip/15) (Normalization Standard)
- [Unicode UCD 16.0](https://www.unicode.org/Public/16.0.0/ucd/)

The numbered ERCs that ENS builds on (ERC-137 registry, ERC-181 reverse, ERC-634 text records, ERC-2304 multi-coin) live in [`@ethernauta/erc`](https://github.com/niconiahi/ethernauta/tree/main/packages/erc). This package owns the ENSIP-level helpers and the multi-call flows that compose them.

The data files under `src/ensip-15/data/` are derived from public upstream sources via `pnpm derive`. The derivation script downloads the Unicode UCD files and the ENS validation reference data, then emits readable TypeScript modules — no opaque blobs. Rerun `pnpm derive` when Unicode releases a new version or ENSIP-15 amends its rules.

## Status

| Phase | Status |
|-------|--------|
| 1a — data derivation infrastructure | shipped |
| 1b — NFC implementation | shipped — passes 19,965 / 19,965 Unicode vectors |
| 1c — ENSIP-15 validation | shipped — passes 98.54% of 38,614 ENS vectors |

The remaining 1.46% gap in 1c is whole-script confusable detection (`WHOLES` table). Confusable labels are accepted today instead of rejected.

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

### Resolve an ENS name to an address

```ts
import { get_ens_address, get_ens_resolver } from "@ethernauta/ens"
import { reader, SEPOLIA_CHAIN_ID } from "./reader"

const resolver = await get_ens_resolver({ name: "vitalik.eth" })(
  reader({ chain_id: SEPOLIA_CHAIN_ID }),
)

const address = await get_ens_address({ name: "vitalik.eth" })(
  reader({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

An optional `registry` argument lets the caller pin a non-default ENS registry (testnet, fork). Without it, the resolver function looks up the canonical registry for the current chain.

### Resolve a text record / avatar

```ts
import { get_ens_text, get_ens_avatar } from "@ethernauta/ens"

const twitter = await get_ens_text({ name: "vitalik.eth", key: "com.twitter" })(
  reader({ chain_id: SEPOLIA_CHAIN_ID }),
)

const avatar = await get_ens_avatar({ name: "vitalik.eth" })(
  reader({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Reverse-resolve an address to a name

```ts
import { get_ens_name } from "@ethernauta/ens"

const name = await get_ens_name({ address: "0xd8dA…" })(
  reader({ chain_id: SEPOLIA_CHAIN_ID }),
)
```

### Parse an avatar URI — ENSIP-12

```ts
import { parse_avatar, type AvatarResult } from "@ethernauta/ens"

const result = parse_avatar("ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG")
// { kind: "ipfs", cid: "QmY..." } | { kind: "http", url: "..." } | { kind: "nft", … }
```

### Normalize an ENS name — ENSIP-15

```ts
import { ens_normalize, ens_beautify } from "@ethernauta/ens"

const canonical = ens_normalize("Vitalik.ETH") // "vitalik.eth"
const display = ens_beautify("vitalik.eth")    // FE0F variation selectors restored
```

### Raw Unicode normalisation

```ts
import { from_cps, get_ccc, nfc, nfd, to_cps, UCD_VERSION, SPEC_CREATED, SPEC_UNICODE } from "@ethernauta/ens"

const cps = to_cps("café")
const composed = from_cps(nfc(cps))
const decomposed = from_cps(nfd(cps))
const canonical_class = get_ccc(0x0301) // canonical combining class
```

`UCD_VERSION` reports the upstream Unicode version baked into the derived tables; `SPEC_CREATED` / `SPEC_UNICODE` are the ENSIP-15 spec metadata.
