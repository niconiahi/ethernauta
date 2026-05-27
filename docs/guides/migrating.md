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
| `new Web3Provider(window.ethereum)` | `createWalletClient({ chain, transport: custom(window.ethereum) })` | `create_provider(window.ethereum).signer({ chain_id: 1 })` |

## Reading a block

```ts
// ethers
const block = await provider.getBlockNumber();

// viem
const block = await publicClient.getBlockNumber();

// ethernauta
const block = await eth_block_number()(reader({ chain_id: 1 }));
```

## Reading a balance

```ts
// ethers
const balance = await provider.getBalance(address);

// viem
const balance = await publicClient.getBalance({ address });

// ethernauta
const balance = await eth_get_balance({ address, block: "latest" })(
  reader({ chain_id: 1 }),
);
```

## Sending a transaction (path 1)

```ts
// ethers
const tx = await signer.sendTransaction({ to, value });

// viem
const hash = await walletClient.sendTransaction({ to, value });

// ethernauta
const hash = await eth_send_transaction({ to, value, input: "0x" })(signer({ chain_id: 1 }));
```

## Sending a transaction (path 2 — separate sign and broadcast)

```ts
// ethers — not first-class; requires raw signer access
const signed = await signer.signTransaction({ to, value });
const tx = await provider.sendTransaction(signed);

// viem — not first-class; eth_signTransaction is feature-flagged
// (most providers don't expose it without configuration)

// ethernauta — first-class, no flags needed
const signed = await eth_sign_transaction({ to, value, input: "0x" })(signer({ chain_id: 1 }));
const hash = await eth_send_raw_transaction(signed)(writer({ chain_id: 1 }));
```

This is the primary differentiator — see [Concepts → two paths](/concepts/two-paths).

## Calling a contract

```ts
// ethers
const contract = new Contract(address, abi, provider);
const balance = await contract.balanceOf(holder);

// viem
const balance = await publicClient.readContract({
  address,
  abi,
  functionName: "balanceOf",
  args: [holder],
});

// ethernauta
const balance = await balance_of({ owner: holder })(
  contract({ chain_id: 1, contract: address }),
);
```

`balance_of` comes from `@ethernauta/erc/20` — no need to wire an ABI fragment for standard interfaces. For custom contracts, use `make_codec` + `eth_call`.

## EIP-712 typed-data

```ts
// ethers
const signature = await signer.signTypedData(domain, types, value);

// viem
const signature = await walletClient.signTypedData({ domain, types, primaryType, message });

// ethernauta
const signature = await sign_typed_data({ account, typed_data })(signer({ chain_id: 1 }));
```

## Listening for events

```ts
// ethers
provider.on("block", (block) => { ... });

// viem
publicClient.watchBlockNumber({ onBlockNumber: (b) => { ... } });

// ethernauta
const unsubscribe = eth_subscribe_new_heads({ on_block: (b) => { ... } })(
  websocket_reader({ chain_id: 1 }),
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
