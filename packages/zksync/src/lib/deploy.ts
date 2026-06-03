// Sibling of packages/op/src/lib/deploy.ts and
// packages/arbitrum/src/lib/deploy.ts: maps an L2 chain id to
// its registered `ZksyncDeploys` record. The registry is keyed
// by L2 chain id because every rollup family has one L1
// bridge-portal set per L2.
//
// Schema-shape note. zkSync's deploys carry L1 addresses one
// level deeper than OP / Arbitrum — verbs read
// `require_deploy_addresses(l2.chain_id).l1.bridgehub` (and
// `.l1.assetRouter`, `.l1.l1Nullifier`, `.l1.baseToken`, …),
// not the flatter `.contracts.<Proxy>` shape OP / Arbitrum
// expose. See packages/zksync/src/core/deploys.ts for the
// rationale on the `l1.*` nesting (per-network singletons +
// per-chain fields share the same record).

import { eip155_300 } from "@ethernauta/chain/eip155-300"
import { eip155_324 } from "@ethernauta/chain/eip155-324"
import {
  type ChainId,
  encode_chain_id,
} from "@ethernauta/transport"
import type { ZksyncDeploys } from "../core/deploys"
import { eip155_300_deploys } from "../deploys/eip155-300"
import { eip155_324_deploys } from "../deploys/eip155-324"

const DEPLOYS: Record<ChainId, ZksyncDeploys> = {
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_324.chainId,
  })]: eip155_324_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_300.chainId,
  })]: eip155_300_deploys,
}

export function require_deploy_addresses(
  chain_id: ChainId,
): ZksyncDeploys {
  const deploys = DEPLOYS[chain_id]
  if (!deploys) {
    throw new Error(
      `not a zksync-family chain: chain_id=${chain_id}`,
    )
  }
  return deploys
}
