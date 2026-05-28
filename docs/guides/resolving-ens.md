---
title: Resolving ENS names
section: Guides
section_order: 3
order: 5
---

# Resolving ENS names

ENS resolution is multi-step: `namehash(name)` → resolver lookup → `addr` / `text` / `contenthash` calls. The `@ethernauta/ens` package composes these into the high-level functions a dapp actually wants.

```ts
import {
  get_ens_address,
  get_ens_name,
  get_ens_text,
  get_ens_avatar,
  ens_normalize,
} from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const ctx = reader({ chain_id: CHAIN_ID });

void get_ens_address;
void get_ens_name;
void get_ens_text;
void get_ens_avatar;
void ens_normalize;
void ctx;
```

## Always normalize first

```ts
import { ens_normalize } from "@ethernauta/ens";

const name = ens_normalize("Vitalik.eth");  // → "vitalik.eth"
void name;
```

ENSIP-15 normalization is **mandatory** — `namehash("Vitalik.eth")` is different from `namehash("vitalik.eth")`. The orchestration functions in `@ethernauta/ens` do NOT auto-normalize; they assume their input is already normalized.

If the input came from a user form, normalize before any lookup.

## Forward: name → address

```ts
import { get_ens_address } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const ctx = reader({ chain_id: CHAIN_ID });

const address = await get_ens_address({ name: "vitalik.eth" })(ctx);
// → "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" | null
void address;
```

Returns `null` if the name has no `addr` record.

## Reverse: address → name

```ts
import { get_ens_name } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const ctx = reader({ chain_id: CHAIN_ID });

const address = parse(AddressSchema, "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045");
const name = await get_ens_name({ address })(ctx);
// → "vitalik.eth" | null
void name;
```

Includes the **forward-verification step** — the reverse record is claim-only, so the function looks up the claimed name's forward address and confirms it matches. If it doesn't, the result is `null`.

## Text records

```ts
import { get_ens_text } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const ctx = reader({ chain_id: CHAIN_ID });

const twitter = await get_ens_text({
  name: "vitalik.eth",
  key: "com.twitter",
})(ctx);

void twitter;
```

Common keys: `email`, `url`, `description`, `com.twitter`, `com.github`, `org.telegram`.

## Avatars

```ts
import { get_ens_avatar } from "@ethernauta/ens";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const ctx = reader({ chain_id: CHAIN_ID });

const avatar = await get_ens_avatar({ name: "vitalik.eth" })(ctx);
void avatar;
```

`AvatarResult` is a discriminated union over the avatar's URI scheme:

- HTTP / HTTPS URLs.
- IPFS / Swarm content hashes.
- NFT pointers (`eip155:1/erc721:0x...:tokenId`).

For NFT pointers the library decodes the contract + token ID but doesn't auto-fetch the image — that's the dapp's call.

## See also

- [@ethernauta/ens](/ens/overview) — full surface, including the ENSIP-15 helpers.
- [ERC-137](/ercs/137), [ERC-181](/ercs/181), [ERC-1577](/ercs/1577), [ERC-2304](/ercs/2304) — the underlying contracts.
