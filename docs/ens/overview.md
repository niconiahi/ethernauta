---
title: "@ethernauta/ens"
section: Overview
section_order: 7
order: 9
---

# @ethernauta/ens

High-level ENS resolution: name → address, address → name, avatars, text records. Plus ENSIP-15 name normalization (the "what counts as a valid name" rules). Composes the lower-level ERC-137 / ERC-181 / ERC-1577 / ERC-2304 method bindings into the multi-call flows dapps actually want.

```bash
pnpm add @ethernauta/ens
```

## Forward resolution

```ts
import { get_ens_address } from "@ethernauta/ens";

const address = await get_ens_address({ name: "vitalik.eth" })(
  reader({ chain_id: eip155_1.chain_id }),
);
// → "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
```

Walks: `namehash(name)` → look up resolver via registry → call `addr(node)` on resolver. Returns `null` if any step yields zero.

## Reverse resolution

```ts
import { get_ens_name } from "@ethernauta/ens";

const name = await get_ens_name({ address })(
  reader({ chain_id: eip155_1.chain_id }),
);
// → "vitalik.eth" or null
```

Includes the **forward-verification step** (ERC-181 reverse records are claim-only; the verifier confirms by checking that the claimed name resolves back to the same address).

## Text records

```ts
import { get_ens_text } from "@ethernauta/ens";

const twitter = await get_ens_text({ name: "vitalik.eth", key: "com.twitter" })(
  reader,
);
```

## Avatars

```ts
import { get_ens_avatar, parse_avatar } from "@ethernauta/ens";

const result = await get_ens_avatar({ name: "vitalik.eth" })(reader);
// AvatarResult: an HTTP URL, an IPFS / Swarm reference, an NFT pointer, ...
```

`parse_avatar` is the lower-level helper that decodes the `avatar` text record's URI scheme (`https://`, `ipfs://`, `eip155:1/erc721:...`, etc.) into a structured shape.

## Resolver lookup

```ts
import { get_ens_resolver } from "@ethernauta/ens";

const resolver_address = await get_ens_resolver({ name: "vitalik.eth" })(reader);
```

Useful when you want to bypass the orchestration and call the resolver directly.

## ENSIP-15 normalization

```ts
import { ens_normalize, ens_beautify } from "@ethernauta/ens";

ens_normalize("Vitalik.eth");          // → "vitalik.eth"
ens_normalize("VitAlik.eth");          // → "vitalik.eth"
ens_normalize("emoji😀.eth");          // → "emoji😀.eth" (NFC-normalized)
ens_beautify("vitalik.eth");           // → "vitalik.eth"
```

Normalization is **mandatory** before hashing — `namehash` of `"Vitalik.eth"` is different from `"vitalik.eth"`. The library never auto-normalizes inside the orchestration functions (`get_ens_address` etc. assume their input is normalized) so the dapp has to call `ens_normalize` first if there's any chance of unnormalized input.

## Surface

### Resolution

| Export | Shape | Purpose |
|---|---|---|
| `get_ens_address` | `Readable<Address \| null>` | Forward resolution. |
| `get_ens_name` | `Readable<string \| null>` | Reverse with forward-verification. |
| `get_ens_text` | `Readable<string \| null>` | Text record. |
| `get_ens_avatar` | `Readable<AvatarResult \| null>` | Decoded avatar. |
| `get_ens_resolver` | `Readable<Address \| null>` | Resolver contract for a name. |

### Normalization (ENSIP-15)

| Export | Purpose |
|---|---|
| `ens_normalize` | Apply the canonicalization rules. |
| `ens_beautify` | Reverse-display safe form (idn-friendly). |
| `to_cps`, `from_cps` | Code-point conversion. |
| `nfd`, `nfc` | Unicode NF normalization. |
| `UCD_VERSION` | The Unicode version baked into the rules. |

### Avatar

| Export | Purpose |
|---|---|
| `parse_avatar` | Decode an avatar URI. |
| `AvatarResult` | The decoded shape (discriminated union of avatar kinds). |

## See also

- [ERC-137](/ercs/137) — registry primitives.
- [ERC-181](/ercs/181) — reverse record primitives.
- [ERC-1577](/ercs/1577) — content hash.
- [ERC-2304](/ercs/2304) — multichain addresses.
- [Guide → resolving ENS names](/guides/resolving-ens).
