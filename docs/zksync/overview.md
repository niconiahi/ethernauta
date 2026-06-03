---
title: "@ethernauta/zksync"
section: zkSync Era
section_order: 11
order: 1
---

# @ethernauta/zksync

zkSync Era–specific primitives. The `zks_*` RPC namespace, the system-contract bindings, the EIP-712 (`0x71`) transaction encoder + signer, per-chain L1 deployment registry, the L1↔L2 bridge verbs — everything that's true of every zkSync Era chain (Era mainnet, Sepolia testnet, plus the wider ZK-chain ecosystem rooted at the same Bridgehub) but isn't part of L1 Ethereum.

```bash
pnpm add @ethernauta/zksync
```

The Yellow Paper substrate — accounts, EVM, RLP, EIP-1559, the `eth_*` method surface — lives in [`@ethernauta/eth`](/eth/overview). This package is the layer on top: the things [the zkSync Era spec](https://docs.zksync.io/) defines that Yellow Paper doesn't.

## What's in the zkSync layer

zkSync Era is a zk-rollup. EVM-equivalent at the execution layer, but the L1 settlement model is fundamentally different from optimistic rollups:

- **Block production.** Sequencer orders L2 transactions and posts batches to a `DiamondProxy` on L1. Validity proofs (zk-SNARKs) settle the L2 state — no fault-proof window, finality is gated on the proof being verified.
- **System contracts.** A set of contracts at `0x000…000{80xx}` (`NonceHolder` at `0x...8003`, `ContractDeployer` at `0x...8006`, `L1Messenger` at `0x...8008`, etc) replace what is implicit on L1. The L2 ↔ L1 message path runs through `L1Messenger`.
- **Bridgehub.** A single L1 contract routes deposits/withdrawals across all ZK-chains in the ecosystem. Per-chain shared bridges + `L1AssetRouter` / `L1Nullifier` handle ERC-20 deposits and the failed-deposit claim flow.
- **EIP-712 transactions (`0x71`).** A custom transaction envelope with `paymaster`, `factoryDeps`, `customSignature`, and a separate fee model (`maxFeePerErgs` historically, now standard 1559-style fields plus paymaster overrides). Distinct from the seven standard tx types in [`@ethernauta/eip`](/eips/overview).

## Surface

| Export | Shape | Purpose |
|---|---|---|
| `zks_estimate_fee` | `Readable<ZksFee>` | Fee estimate for a `0x71` transaction, including paymaster overhead. |
| `zks_estimateGasL1ToL2` | `Readable<Hex>` | L2-side gas needed for an L1 → L2 message. |
| `zks_getBridgehubContract` | `Readable<Address>` | L1 Bridgehub address from the L2 node. |
| `zks_getMainContract` | `Readable<Address>` | L1 DiamondProxy address. |
| `zks_getBridgeContracts` | `Readable<BridgeContracts>` | L1 shared-bridge / L1AssetRouter / L1Nullifier addresses. |
| `zks_L1ChainId` | `Readable<Hex>` | L1 chain id from the L2 node. |
| `zks_L1BatchNumber` | `Readable<Hex>` | Latest L1 batch the L2 has committed to L1. |
| `zks_getBlockDetails` | `Readable<BlockDetails>` | L1-batch + commit/prove/execute state for an L2 block. |
| `zks_getL2ToL1LogProof` | `Readable<L2ToL1LogProof>` | Merkle witness for finalizing an L2 → L1 message on L1. |
| `encode_zksync_transaction` | helper | Encode the zkSync `0x71` envelope. |
| `sign_zksync_transaction` | `Signable<Hex>` | Sign a `0x71` transaction with a `@ethernauta/crypto` keypair. |
| `require_deploy_addresses` | `(chain_id: ChainId) => ZksyncDeploys` | Per-chain L1 deployment addresses (Bridgehub, DiamondProxy, shared bridge, L1AssetRouter, L1Nullifier). |
| `estimate_zksync_fees` | `Readable<Fees>` | L1 + L2 fee estimate composed on top of `zks_estimate_fee`. |

Bridge verbs are documented separately at [`/bridge/zksync`](/bridge/zksync).

## End-to-end — read the L1 batch number on zkSync Era

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport"
import { zks_L1BatchNumber } from "@ethernauta/zksync"
import { eip155_324 } from "@ethernauta/chain/eip155-324"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_324.chainId,
})
const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [http("https://mainnet.era.zksync.io")],
  },
])

const batch = await zks_L1BatchNumber()(reader({ chain_id: CHAIN_ID }))
```

## See also

- [`/bridge/zksync`](/bridge/zksync) — deposit / withdraw / claim flow.
- [`/op/overview`](/op/overview) — OP-Stack sibling.
- [`/arbitrum/overview`](/arbitrum/overview) — Arbitrum sibling.
- [Concepts → folder-shaped standards](/concepts/folder-shaped-standards) — why rollup-specific code lives in its own package.
