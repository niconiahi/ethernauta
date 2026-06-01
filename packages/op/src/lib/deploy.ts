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

const DEPLOYS: Record<ChainId, OpDeploys> = {
  [encode_chain_id({ namespace: "eip155", reference: eip155_10.chainId })]: eip155_10_deploys,
  [encode_chain_id({ namespace: "eip155", reference: eip155_11155420.chainId })]: eip155_11155420_deploys,
  [encode_chain_id({ namespace: "eip155", reference: eip155_480.chainId })]: eip155_480_deploys,
  [encode_chain_id({ namespace: "eip155", reference: eip155_1868.chainId })]: eip155_1868_deploys,
  [encode_chain_id({ namespace: "eip155", reference: eip155_34443.chainId })]: eip155_34443_deploys,
  [encode_chain_id({ namespace: "eip155", reference: eip155_7777777.chainId })]: eip155_7777777_deploys,
}

export function require_deploy_addresses(
  chain_id: ChainId,
): OpDeploys {
  const deploys = DEPLOYS[chain_id]
  if (!deploys) {
    throw new Error(
      `not an op stack chain: chain_id=${chain_id}`,
    )
  }
  return deploys
}
