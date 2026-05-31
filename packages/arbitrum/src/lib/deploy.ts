import type { Chain } from "@ethernauta/chain"
import { eip155_1729 } from "@ethernauta/chain/eip155-1729"
import { eip155_1996 } from "@ethernauta/chain/eip155-1996"
import { eip155_33139 } from "@ethernauta/chain/eip155-33139"
import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { eip155_42170 } from "@ethernauta/chain/eip155-42170"
import { eip155_70700 } from "@ethernauta/chain/eip155-70700"
import { eip155_98865 } from "@ethernauta/chain/eip155-98865"
import { eip155_421614 } from "@ethernauta/chain/eip155-421614"
import { eip155_660279 } from "@ethernauta/chain/eip155-660279"
import { eip155_1380012617 } from "@ethernauta/chain/eip155-1380012617"
import {
  type ChainId,
  encode_chain_id,
} from "@ethernauta/transport"
import type { ArbitrumDeploys } from "../core/deploys"
import { eip155_1729_deploys } from "../deploys/eip155-1729"
import { eip155_1996_deploys } from "../deploys/eip155-1996"
import { eip155_33139_deploys } from "../deploys/eip155-33139"
import { eip155_42161_deploys } from "../deploys/eip155-42161"
import { eip155_42170_deploys } from "../deploys/eip155-42170"
import { eip155_70700_deploys } from "../deploys/eip155-70700"
import { eip155_98865_deploys } from "../deploys/eip155-98865"
import { eip155_421614_deploys } from "../deploys/eip155-421614"
import { eip155_660279_deploys } from "../deploys/eip155-660279"
import { eip155_1380012617_deploys } from "../deploys/eip155-1380012617"

function key_for(chain: Chain): ChainId {
  return encode_chain_id({
    namespace: "eip155",
    reference: chain.chainId,
  })
}

const DEPLOYS: Record<ChainId, ArbitrumDeploys> = {
  [key_for(eip155_42161)]: eip155_42161_deploys,
  [key_for(eip155_42170)]: eip155_42170_deploys,
  [key_for(eip155_421614)]: eip155_421614_deploys,
  [key_for(eip155_660279)]: eip155_660279_deploys,
  [key_for(eip155_33139)]: eip155_33139_deploys,
  [key_for(eip155_1996)]: eip155_1996_deploys,
  [key_for(eip155_70700)]: eip155_70700_deploys,
  [key_for(eip155_1380012617)]: eip155_1380012617_deploys,
  [key_for(eip155_1729)]: eip155_1729_deploys,
  [key_for(eip155_98865)]: eip155_98865_deploys,
}

export function require_deploy_addresses(
  chain: Chain,
): ArbitrumDeploys {
  const deploys = DEPLOYS[key_for(chain)]
  if (!deploys) {
    throw new Error(
      `not an arbitrum-family chain: chainId=${chain.chainId} (${chain.name})`,
    )
  }
  return deploys
}
