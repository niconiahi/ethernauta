---
title: Migrating from ethers / viem
section: Guides
section_order: 3
order: 8
---

# Migrating from ethers / viem

What the same operations look like across the three libraries. This guide is a translation reference — not an argument that you should switch — though the third column will, in places, make the case on its own.

## Setup

| ethers | viem | ethernauta |
|---|---|---|
| `new JsonRpcProvider(url)` | `createPublicClient({ chain, transport: http() })` | `create_reader([eip155_1])` |
| `new Web3Provider(window.ethereum)` | `createWalletClient({ chain, transport: custom(window.ethereum) })` | `create_provider(window.ethereum).signer({ chain_id: "eip155:1" })` |

## Reading a block

```ts
import { JsonRpcProvider } from "ethers";
import { createPublicClient, http as viem_http } from "viem";
import { mainnet } from "viem/chains";
import { eth_blockNumber } from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_provider = new JsonRpcProvider("https://ethereum-rpc.publicnode.com");
const ethers_block = await ethers_provider.getBlockNumber();
void ethers_block;

// viem
const publicClient = createPublicClient({ chain: mainnet, transport: viem_http() });
const viem_block = await publicClient.getBlockNumber();
void viem_block;

// ethernauta
const block = await eth_blockNumber()(reader({ chain_id: CHAIN_ID }));
void block;
```

## Reading a balance

```ts
import { JsonRpcProvider } from "ethers";
import { createPublicClient, http as viem_http } from "viem";
import { mainnet } from "viem/chains";
import { AddressSchema } from "@ethernauta/core";
import { eth_getBalance } from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

const address = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_provider = new JsonRpcProvider("https://ethereum-rpc.publicnode.com");
const ethers_balance = await ethers_provider.getBalance(address);
void ethers_balance;

// viem
const publicClient = createPublicClient({ chain: mainnet, transport: viem_http() });
const viem_balance = await publicClient.getBalance({ address });
void viem_balance;

// ethernauta
const balance = await eth_getBalance([address, "latest"])(
  reader({ chain_id: CHAIN_ID }),
);
void balance;
```

## Sending a transaction (path 1)

```ts
import type { Wallet } from "ethers";
import type { WalletClient } from "viem";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { eth_sendTransaction } from "@ethernauta/eth";
import { create_signer, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

declare const ethers_signer: Wallet;
declare const walletClient: WalletClient;

const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(UintSchema, "0x16345785D8A0000");
const input = parse(BytesSchema, "0x");
const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_tx = await ethers_signer.sendTransaction({ to, value });
void ethers_tx;

// viem — call shape sketch
void walletClient;

// ethernauta
const hash = await eth_sendTransaction([{ to, value, input }])(signer({ chain_id: CHAIN_ID }));
void hash;
```

## Sending a transaction (path 2 — separate sign and broadcast)

```ts
import type { Wallet, JsonRpcProvider } from "ethers";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { eth_sendRawTransaction, eth_signTransaction } from "@ethernauta/eth";
import { create_signer, create_writer, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

declare const ethers_signer: Wallet;
declare const ethers_provider: JsonRpcProvider;

const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(UintSchema, "0x16345785D8A0000");
const input = parse(BytesSchema, "0x");
const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const writer = create_writer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers — not first-class; requires raw signer access
const ethers_signed = await ethers_signer.signTransaction({ to, value });
const ethers_tx = await ethers_provider.broadcastTransaction(ethers_signed);
void ethers_tx;

// viem — not first-class; eth_signTransaction is feature-flagged
// (most providers don't expose it without configuration)

// ethernauta — first-class, no flags needed
const signed = await eth_signTransaction([{ to, value, input }])(signer({ chain_id: CHAIN_ID }));
const hash = await eth_sendRawTransaction([signed])(writer({ chain_id: CHAIN_ID }));
void hash;
```

This is the primary differentiator — see [Concepts → two paths](/concepts/two-paths).

## Calling a contract

```ts
import { Contract, JsonRpcProvider } from "ethers";
import { createPublicClient, http as viem_http, parseAbi } from "viem";
import { mainnet } from "viem/chains";
import type { Bytes } from "@ethernauta/core";
import { AddressSchema } from "@ethernauta/core";
import { balanceOf } from "@ethernauta/erc/20";
import { eth_call } from "@ethernauta/eth";
import { contract, create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

const address = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const holder = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const abi = ["function balanceOf(address) view returns (uint256)"];
const ethers_provider = new JsonRpcProvider("https://ethereum-rpc.publicnode.com");
const ethers_contract = new Contract(address, abi, ethers_provider);
const ethers_balance = await ethers_contract.balanceOf(holder);
void ethers_balance;

// viem
const publicClient = createPublicClient({ chain: mainnet, transport: viem_http() });
const viem_balance = await publicClient.readContract({
  address,
  abi: parseAbi(["function balanceOf(address) view returns (uint256)"]),
  functionName: "balanceOf",
  args: [holder],
});
void viem_balance;

// ethernauta
const callable = balanceOf([holder])(contract({ chain_id: CHAIN_ID, to: address }));
const result_bytes: Bytes = await eth_call([{ to: callable.to, input: callable.data }])(
  reader({ chain_id: CHAIN_ID }),
);
const balance = callable.decode(result_bytes);
void balance;
```

`balanceOf` comes from `@ethernauta/erc/20` — no need to wire an ABI fragment for standard interfaces. For custom contracts, use `make_codec` + `eth_call`.

## EIP-712 typed-data

```ts
import type { Wallet } from "ethers";
import type { WalletClient } from "viem";
import type { Address } from "@ethernauta/core";
import { AddressSchema } from "@ethernauta/core";
import { eth_signTypedData_v4, type TypedData } from "@ethernauta/eip/712";
import { create_signer, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

declare const ethers_signer: Wallet;
declare const walletClient: WalletClient;
declare const typed_data: TypedData;
const account: Address = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_sig = await ethers_signer.signTypedData(
  typed_data.domain,
  typed_data.types,
  typed_data.message,
);
void ethers_sig;

// viem — call shape sketch
void walletClient;

// ethernauta
const signature = await eth_signTypedData_v4([account, typed_data])(signer({ chain_id: CHAIN_ID }));
void signature;
```

## Listening for events

```ts
import type { WebSocketProvider } from "ethers";
import type { PublicClient } from "viem";
import { eth_subscribeNewHeads } from "@ethernauta/eth";
import { create_subscriber, encode_chain_id, websocket } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

declare const ethers_provider: WebSocketProvider;
declare const publicClient: PublicClient;

// ethers
ethers_provider.on("block", (block: number) => { void block; });

// viem
publicClient.watchBlockNumber({ onBlockNumber: (b: bigint) => { void b; } });

// ethernauta (WebSocket transport)
const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const subscriber = create_subscriber([
  { chainId: CHAIN_ID, websockets: [websocket("wss://ethereum-rpc.publicnode.com")] },
]);
const unsubscribe = await eth_subscribeNewHeads()(
  subscriber({ chain_id: CHAIN_ID }),
  (block) => { void block; },
);
void unsubscribe;
```

The Ethernauta version requires a WebSocket transport (subscriptions can't run over HTTP).

## The mental model swap

| What you do in ethers/viem | What you do in Ethernauta |
|---|---|
| Pick a client kind (`PublicClient`, `WalletClient`, …) | Pick a resolver shape (`Readable`, `Writable`, `Signable`, `Callable`) |
| Call methods on the client | Curry: `method(args)(resolver(...))` |
| Pass an ABI alongside the call | Use the per-ERC binding, or `make_codec` for custom |
| Choose between client kinds at construction | Compose any shape per call |
| One way to send transactions | Choose between path 1 and path 2 per call |

## See also

- [Concepts → resolver shapes](/concepts/resolver-shapes).
- [Concepts → two paths](/concepts/two-paths).
- [@ethernauta/eth](/eth/overview) — the method index.
