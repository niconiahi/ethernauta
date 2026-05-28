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
import { eth_blockNumber } from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

declare const provider: any;       // ethers placeholder
declare const publicClient: any;   // viem placeholder

const SEPOLIA = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: SEPOLIA, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_block = await provider.getBlockNumber();

// viem
const viem_block = await publicClient.getBlockNumber();

// ethernauta
const block = await eth_blockNumber()(reader({ chain_id: SEPOLIA }));
```

## Reading a balance

```ts
import { addressSchema } from "@ethernauta/core";
import { eth_getBalance } from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

declare const provider: any;
declare const publicClient: any;

const address = parse(addressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const CHAIN = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_balance = await provider.getBalance(address);

// viem
const viem_balance = await publicClient.getBalance({ address });

// ethernauta
const balance = await eth_getBalance({ address, block: "latest" })(
  reader({ chain_id: CHAIN }),
);
```

## Sending a transaction (path 1)

```ts
import { addressSchema, uintSchema } from "@ethernauta/core";
import { eth_sendTransaction } from "@ethernauta/eth";
import { create_signer, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

declare const ethers_signer: any;
declare const walletClient: any;

const to = parse(addressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(uintSchema, "0x16345785D8A0000");
const CHAIN = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_tx = await ethers_signer.sendTransaction({ to, value });

// viem
const viem_hash = await walletClient.sendTransaction({ to, value });

// ethernauta
const hash = await eth_sendTransaction([{ to, value, input: "0x" }])(signer({ chain_id: CHAIN }));
```

## Sending a transaction (path 2 — separate sign and broadcast)

```ts
import { addressSchema, uintSchema } from "@ethernauta/core";
import { eth_sendRawTransaction, eth_signTransaction } from "@ethernauta/eth";
import { create_signer, create_writer, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

declare const ethers_signer: any;
declare const provider: any;

const to = parse(addressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(uintSchema, "0x16345785D8A0000");
const CHAIN = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const writer = create_writer([
  { chainId: CHAIN, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers — not first-class; requires raw signer access
const ethers_signed = await ethers_signer.signTransaction({ to, value });
const ethers_tx = await provider.sendTransaction(ethers_signed);

// viem — not first-class; eth_signTransaction is feature-flagged
// (most providers don't expose it without configuration)

// ethernauta — first-class, no flags needed
const signed = await eth_signTransaction([{ to, value, input: "0x" }])(signer({ chain_id: CHAIN }));
const hash = await eth_sendRawTransaction([signed])(writer({ chain_id: CHAIN }));
```

This is the primary differentiator — see [Concepts → two paths](/concepts/two-paths).

## Calling a contract

```ts
import { addressSchema } from "@ethernauta/core";
import { balanceOf } from "@ethernauta/erc/20";
import { create_contract, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { parse } from "valibot";

declare const provider: any;
declare const publicClient: any;
declare const Contract: any;       // ethers placeholder
declare const abi: any;

const address = parse(addressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const holder = parse(addressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const CHAIN = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const contract = create_contract([
  { chainId: CHAIN, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_contract = new Contract(address, abi, provider);
const ethers_balance = await ethers_contract.balanceOf(holder);

// viem
const viem_balance = await publicClient.readContract({
  address,
  abi,
  functionName: "balanceOf",
  args: [holder],
});

// ethernauta
const balance = await balanceOf([holder])(
  contract({ chain_id: CHAIN, contract: address }),
);
```

`balanceOf` comes from `@ethernauta/erc/20` — no need to wire an ABI fragment for standard interfaces. For custom contracts, use `make_codec` + `eth_call`.

## EIP-712 typed-data

```ts
import { eth_signTypedData_v4 } from "@ethernauta/eip/712";
import { create_signer, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

declare const ethers_signer: any;
declare const walletClient: any;
declare const domain: any;
declare const types: any;
declare const value: any;
declare const primaryType: any;
declare const message: any;
declare const account: `0x${string}`;
declare const typed_data: any;

const CHAIN = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const signer = create_signer([
  { chainId: CHAIN, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

// ethers
const ethers_sig = await ethers_signer.signTypedData(domain, types, value);

// viem
const viem_sig = await walletClient.signTypedData({ domain, types, primaryType, message });

// ethernauta
const signature = await eth_signTypedData_v4([account, typed_data])(signer({ chain_id: CHAIN }));
```

## Listening for events

```ts no-check
// Subscriptions need a WebSocket transport — wiring it in a doc snippet
// would obscure the comparison. Mock-typed for readability.
declare const provider: any;
declare const publicClient: any;
declare const websocket_reader: any;
declare const eth_subscribeNewHeads: any;

// ethers
provider.on("block", (block: number) => { /* … */ });

// viem
publicClient.watchBlockNumber({ onBlockNumber: (b: bigint) => { /* … */ } });

// ethernauta
const unsubscribe = eth_subscribeNewHeads({ on_block: (b: unknown) => { /* … */ } })(
  websocket_reader({ chain_id: "eip155:1" }),
);
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
