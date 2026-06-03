[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/zksync&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/zksync&treeshake=[*])

## Philosophy

zkSync Era–specific primitives. The `zks_*` RPC namespace, the system-contract bindings (NonceHolder, ContractDeployer, L1Messenger, L2 Bridgehub), the EIP-712 (`0x71`) transaction encoder + signer, per-chain L1 deployment registry, and the L1↔L2 bridge verbs — everything that's true of every zkSync Era chain (Era mainnet, Sepolia testnet, and the ZK-chain ecosystem) but isn't part of L1 Ethereum.

The Yellow-Paper substrate — accounts, EVM, RLP, EIP-1559, the `eth_*` method surface — stays in [`@ethernauta/eth`](https://github.com/niconiahi/ethernauta/tree/main/packages/eth). This package is the layer on top.

## Modules

- [arbitrum](https://github.com/niconiahi/ethernauta/tree/main/packages/arbitrum) [[NPM](https://www.npmjs.com/package/@ethernauta/arbitrum)]
- [op](https://github.com/niconiahi/ethernauta/tree/main/packages/op) [[NPM](https://www.npmjs.com/package/@ethernauta/op)]
- [zksync](https://github.com/niconiahi/ethernauta/tree/main/packages/zksync) [[NPM](https://www.npmjs.com/package/@ethernauta/zksync)]

## API

### `zks_*` RPC — `Readable<T>`

```ts
import {
  zks_estimateFee,
  zks_estimateGasL1ToL2,
  zks_getBridgehubContract,
  zks_getMainContract,
  zks_getBridgeContracts,
  zks_L1ChainId,
  zks_L1BatchNumber,
  zks_getBlockDetails,
  zks_getL2ToL1MsgProof,
  // …
} from "@ethernauta/zksync"
```

The full `zks_*` consensus-side surface — fee estimation, batch/block details, L1↔L2 message proofs.

### EIP-712 transaction type `0x71`

```ts
import {
  encode_zksync_transaction,
  hash_zksync_transaction,
  build_zksync_typed_data,
  sign_zksync_transaction,
  ZKSYNC_TRANSACTION_TYPE,
} from "@ethernauta/zksync"
```

The zkSync-specific transaction envelope with `paymaster`, `factoryDeps`, and `customSignature` fields. Composes with `@ethernauta/crypto` for the actual signing primitive.

### System contracts

```ts
import {
  NonceHolder,         // 0x...8003
  ContractDeployer,    // 0x...8006
  L1Messenger,         // 0x...8008
  BridgehubL2,
  L2BaseToken,
  L2AssetRouter,
} from "@ethernauta/zksync"
```

`Callable<T>` / `Signable<T>` bindings against the fixed-address system contracts living at the `0x000…000{80xx}` range.

### Per-chain L1 deploys

```ts
import { require_deploy_addresses } from "@ethernauta/zksync"
import { eip155_324 } from "@ethernauta/chain/eip155-324"

const deploys = require_deploy_addresses(eip155_324)
// { bridgehub, diamondProxy, sharedBridge, l1AssetRouter, l1Nullifier, … }
```

L1 deployment addresses for zkSync Era mainnet and Sepolia.

### Bridge verbs — `Bridgeable<T>`

```ts
import {
  send_eth,
  send_erc20,
  send_message,
  start_withdraw_eth,
  start_withdraw_erc20,
  start_withdraw_message,
  execute_withdraw,
  claim_failed_deposit,
  fetch_message_proof,
  fetch_failed_deposit_proof,
  get_status,
  decode_l1_message_sent,
  decode_new_priority_request,
} from "@ethernauta/zksync/bridge"

import { create_bridge } from "@ethernauta/transport"

const bridge = create_bridge(CHAINS)({
  l1_chain_id: ETH_MAINNET,
  l2_chain_id: ZKSYNC_ERA,
})

const hash = await send_eth({ to, value })(bridge.signer)
```

Covers L1 → L2 deposits via the Bridgehub, the `claim_failed_deposit` escape hatch for reverted deposits, L2 → L1 withdrawals (start on L2 via the L1Messenger, execute on L1 via the L1Nullifier), and event decoders for parsing `L1MessageSent` / `NewPriorityRequest` off the receipts. Errors are typed.

### Solidity sources

The vendored zkSync system contracts and bridge contracts live colocated under `packages/zksync/src/system-contracts/<contract>/` and `packages/zksync/src/bridge/<contract>/`. `pnpm pull-contracts` refreshes them from the upstream repo; `pnpm pull-deploys` regenerates the per-chain L1 deploys registry.
