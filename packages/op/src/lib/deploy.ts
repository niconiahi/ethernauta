import type { Chain } from "@ethernauta/chain"
import { eip155_10 } from "@ethernauta/chain/eip155-10"
import { eip155_480 } from "@ethernauta/chain/eip155-480"
import { eip155_1868 } from "@ethernauta/chain/eip155-1868"
import { eip155_34443 } from "@ethernauta/chain/eip155-34443"
import { eip155_7777777 } from "@ethernauta/chain/eip155-7777777"
import { eip155_11155420 } from "@ethernauta/chain/eip155-11155420"
import {
  type ChainId,
  encode_chain_id,
} from "@ethernauta/transport"
import type { OpDeploys } from "../core/deploys"
import { eip155_10_deploys } from "../deploys/eip155-10"
import { eip155_480_deploys } from "../deploys/eip155-480"
import { eip155_1868_deploys } from "../deploys/eip155-1868"
import { eip155_34443_deploys } from "../deploys/eip155-34443"
import { eip155_7777777_deploys } from "../deploys/eip155-7777777"
import { eip155_11155420_deploys } from "../deploys/eip155-11155420"

function key_for(chain: Chain): ChainId {
  return encode_chain_id({
    namespace: "eip155",
    reference: chain.chainId,
  })
}

const DEPLOYS: Record<ChainId, OpDeploys> = {
  [key_for(eip155_10)]: eip155_10_deploys,
  [key_for(eip155_11155420)]: eip155_11155420_deploys,
  [key_for(eip155_480)]: eip155_480_deploys,
  [key_for(eip155_1868)]: eip155_1868_deploys,
  [key_for(eip155_34443)]: eip155_34443_deploys,
  [key_for(eip155_7777777)]: eip155_7777777_deploys,
}

export function require_deploy_addresses(
  chain: Chain,
): OpDeploys {
  const deploys = DEPLOYS[key_for(chain)]
  if (!deploys) {
    throw new Error(
      `not an op stack chain: chainId=${chain.chainId} (${chain.name})`,
    )
  }
  return deploys
}
