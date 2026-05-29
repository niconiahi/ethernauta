---
title: "@ethernauta/ens"
section: Overview
section_order: 7
order: 9
---

# @ethernauta/ens

High-level ENS resolution: name → address, address → name, avatars, text records. Plus ENSIP-10 wildcard resolution (basenames, L2 ENS), ENSIP-15 name normalization (the "what counts as a valid name" rules), and CCIP-Read fall-through on every resolver call. Composes the lower-level ERC-137 / ERC-181 / ERC-1577 / ERC-2304 method bindings into the multi-call flows dapps actually want.

```bash
pnpm add @ethernauta/ens
```

## Forward resolution

```ts
import { get_ens_address } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const address = await get_ens_address({ name: "vitalik.eth" })(
  reader({ chain_id: CHAIN_ID }),
);
// → "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
void address;
```

Walks: `namehash(name)` → parent-walk to find the resolver (handles wildcard registrations at parent labels) → call `addr(node)` directly, or wrap as `resolve(dnsEncode(name), addr(node).calldata)` for ENSIP-10 wildcard resolvers. Every step routes through `eth_call_ccip` so off-chain resolution (basenames, L2 ENS) just works. Returns `null` if any step yields zero.

## Reverse resolution

```ts
import { parse } from "valibot";
import { AddressSchema } from "@ethernauta/core";
import { get_ens_name } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const address = parse(AddressSchema, "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045");
const name = await get_ens_name({ address })(
  reader({ chain_id: CHAIN_ID }),
);
// → "vitalik.eth" or null
void name;
```

Includes the **forward-verification step** (ERC-181 reverse records are claim-only; the verifier confirms by checking that the claimed name resolves back to the same address).

## Text records

```ts
import { get_ens_text } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const twitter = await get_ens_text({ name: "vitalik.eth", key: "com.twitter" })(
  reader({ chain_id: CHAIN_ID }),
);
void twitter;
```

## Avatars

```ts
import { get_ens_avatar } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const result = await get_ens_avatar({ name: "vitalik.eth" })(
  reader({ chain_id: CHAIN_ID }),
);
// AvatarResult: an HTTP URL, an IPFS / Swarm reference, an NFT pointer, ...
void result;
```

`parse_avatar` is the lower-level helper that decodes the `avatar` text record's URI scheme (`https://`, `ipfs://`, `eip155:1/erc721:...`, etc.) into a structured shape.

## Resolver lookup

```ts
import { get_ens_resolver } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const resolver_address = await get_ens_resolver({ name: "vitalik.eth" })(
  reader({ chain_id: CHAIN_ID }),
);
void resolver_address;
```

Useful when you want to bypass the orchestration and call the resolver directly.

## ENSIP-15 normalization

```ts
import { ens_normalize, ens_beautify } from "@ethernauta/ens";

void ens_normalize("Vitalik.eth");          // → "vitalik.eth"
void ens_normalize("VitAlik.eth");          // → "vitalik.eth"
void ens_normalize("emoji😀.eth");          // → "emoji😀.eth" (NFC-normalized)
void ens_beautify("vitalik.eth");           // → "vitalik.eth"
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
| `get_ens_resolver` | `Readable<Address \| null>` | Resolver contract for a name (direct registry lookup, no parent walk). |
| `find_resolver` | `(name, registry?, ctx) => Promise<FindResolverResult \| null>` | Parent-walk variant. Returns the resolver address plus the parent label it was found at — needed to decide between legacy `addr(node)` and ENSIP-10 `resolve(name, data)`. |

### Wildcard (ENSIP-10)

| Export | Purpose |
|---|---|
| `dns_encode` | DNS wire-format encoding for `resolve(name, data)`. |
| `resolve` | ENSIP-10 outer call binding (`Callable<Bytes>`) — wraps an inner method's calldata for wildcard resolvers. |
| `ENSIP10_INTERFACE_ID` | ERC-165 interface ID for `resolve(bytes,bytes)` (`0x9061b923`). |

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

- [EIP-3668](/eips/3668) — CCIP-Read, the protocol every resolver call falls through to.
- [ERC-137](/ercs/137) — registry primitives.
- [ERC-181](/ercs/181) — reverse record primitives.
- [ERC-1577](/ercs/1577) — content hash.
- [ERC-2304](/ercs/2304) — multichain addresses.
- [Guide → resolving ENS names](/guides/resolving-ens).
