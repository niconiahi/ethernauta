---
title: "Chains"
section: OP Stack
section_order: 9
order: 5
---

# Chains

OP Stack ships as a *family* of chains. Same code, same L2 predeploys
at the `0x4200…` namespace, same op-node — but each chain has its own
L1 deployment (portal address, dispute-game factory address, batcher
EOA, sequencer feeds, fault-proof settings).

`@ethernauta/op` ships those L1 addresses as data, sourced from the
[superchain-registry](https://github.com/ethereum-optimism/superchain-registry) at a pinned SHA.
Dapps look them up by passing the same `Chain` object they already
use everywhere else.

## Supported chains (v1)

| Chain | chain_id | `EthLockboxProxy` | `FaultDisputeGame` |
|---|---|---|---|
| OP Mainnet | 10 | ✓ | ✓ |
| OP Sepolia | 11155420 | ✓ | ✓ |
| Worldchain | 480 | — | — |
| Soneium | 1868 | ✓ | — |
| Mode | 34443 | — | — |
| Zora | 7777777 | — | — |

Base (8453) and Base Sepolia (84532) are not in the superchain-registry
(Coinbase publishes Base deployments separately). They will land in a
future bump once a secondary source is wired in.

The two `?`-marked contracts have legitimate normative reasons to be
absent on some chains — see the **Optional contracts** section below.

## Lookup

```ts
import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { require_deploy_addresses } from "@ethernauta/op"

const deploys = require_deploy_addresses(eip155_10)
deploys.contracts.OptimismPortalProxy
// → "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"

deploys.roles.Guardian
// → "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
```

`require_deploy_addresses(chain)` takes a `Chain` from
`@ethernauta/chain` and returns the parsed `OpDeploys` for that
chain. If the chain isn't an OP Stack chain we ship deploy data
for, it throws.

The Chain object is the only identifier the function deals in — no
CAIP-2 strings, no raw chain_ids. Internally the lookup keys the
registry by `encode_chain_id({ namespace: "eip155", reference: chain.chainId })`
so the chain primitive and the deploy primitive can't drift.

## Shape

```ts
type OpDeploys = {
  contracts: {
    AddressManager: Address
    AnchorStateRegistryProxy: Address
    DelayedWETHProxy: Address
    DisputeGameFactoryProxy: Address
    EthLockboxProxy?: Address
    FaultDisputeGame?: Address
    L1CrossDomainMessengerProxy: Address
    L1ERC721BridgeProxy: Address
    L1StandardBridgeProxy: Address
    MIPS: Address
    OptimismMintableERC20FactoryProxy: Address
    OptimismPortalProxy: Address
    PermissionedDisputeGame: Address
    PreimageOracle: Address
    ProxyAdmin: Address
    SuperchainConfig: Address
    SystemConfigProxy: Address
  }
  roles: {
    BatchSubmitter: Address
    Challenger: Address
    Guardian: Address
    Proposer: Address
    ProxyAdminOwner: Address
    SystemConfigOwner: Address
    UnsafeBlockSigner: Address
  }
}
```

The split mirrors upstream's own
[`validation/standard/`](https://github.com/ethereum-optimism/superchain-registry/tree/main/validation/standard)
TOMLs:

- **`contracts`** — proxied implementations and singleton contracts on
  L1. Callable.
- **`roles`** — EOAs or multisigs holding privileged roles
  (batch submitter, challenger, guardian, proxy-admin owner, etc).

Field names are taken verbatim from upstream — a dev reading
`deploys.contracts.DisputeGameFactoryProxy` can grep
superchain-registry directly without learning a renaming map.

## Optional contracts

Two fields are `optional()` in the schema with normative backing from
the [Standard Rollup Charter](https://gov.optimism.io/t/season-6-draft-standard-rollup-charter/8135)
via the registry's
[`validation/standard/standard-versions-mainnet.toml`](https://github.com/ethereum-optimism/superchain-registry/blob/main/validation/standard/standard-versions-mainnet.toml).

- **`EthLockboxProxy`** — added in `op-contracts/v6.0.0`. Pre-v6 chains
  legitimately do not deploy it. Present on OP Mainnet, OP Sepolia,
  and Soneium; absent on Worldchain, Mode, and Zora.
- **`FaultDisputeGame`** — required by the Charter for a "standard
  chain", but absent on chains still running permissioned-only
  dispute games (pre-graduation from `PermissionedDisputeGame`).
  Present only on OP Mainnet and OP Sepolia.

Every other field is required for every chain we ship.

## Composition with reads

The deploys are plain `Address` values. Compose with the standard
reader/contract resolvers in the usual way — there's no special
"OP-aware" call shape:

```ts
import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { balance_of } from "@ethernauta/erc/20"
import { require_deploy_addresses } from "@ethernauta/op"
import {
  create_contract,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_10.chainId,
})
const contract = create_contract([
  {
    chainId: CHAIN_ID,
    transports: [http("https://mainnet.optimism.io")],
  },
])
const { contracts } = require_deploy_addresses(eip155_10)

const portal_balance = await balance_of({
  address: contracts.OptimismPortalProxy,
  // …
})(contract({ chain_id: CHAIN_ID }))
```

## Bumping

`pnpm --filter @ethernauta/op pull-superchain-registry` regenerates the
per-chain files from the pinned SHA. Bump cadence + procedure:
[`packages/op/src/deploys/SOURCES.md`](https://github.com/niconiahi/ethernauta/blob/main/packages/op/src/deploys/SOURCES.md).

## See also

- [`/op/overview`](/op/overview) — package introduction.
- [`/op/predeploys`](/op/predeploys) — the L2-side predeploys at the
  `0x4200…` namespace (constant across every OP Stack chain).
- [`/chain/overview`](/chain/overview) — base `@ethernauta/chain`
  definitions this layer keys off.
- [Standard Rollup Charter (Season 6)](https://gov.optimism.io/t/season-6-draft-standard-rollup-charter/8135) — governance definition of a "standard chain".
- [superchain-registry](https://github.com/ethereum-optimism/superchain-registry) — source of truth for OP Stack chain definitions.
