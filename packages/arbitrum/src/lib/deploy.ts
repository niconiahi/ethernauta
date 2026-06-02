import { eip155_1729 } from "@ethernauta/chain/eip155-1729"
import { eip155_1996 } from "@ethernauta/chain/eip155-1996"
import { eip155_2187 } from "@ethernauta/chain/eip155-2187"
import { eip155_2911 } from "@ethernauta/chain/eip155-2911"
import { eip155_7887 } from "@ethernauta/chain/eip155-7887"
import { eip155_33139 } from "@ethernauta/chain/eip155-33139"
import { eip155_41455 } from "@ethernauta/chain/eip155-41455"
import { eip155_42161 } from "@ethernauta/chain/eip155-42161"
import { eip155_42170 } from "@ethernauta/chain/eip155-42170"
import { eip155_70700 } from "@ethernauta/chain/eip155-70700"
import { eip155_98865 } from "@ethernauta/chain/eip155-98865"
import { eip155_111188 } from "@ethernauta/chain/eip155-111188"
import { eip155_421614 } from "@ethernauta/chain/eip155-421614"
import { eip155_660279 } from "@ethernauta/chain/eip155-660279"
import { eip155_10241024 } from "@ethernauta/chain/eip155-10241024"
import { eip155_21000000 } from "@ethernauta/chain/eip155-21000000"
import { eip155_666666666 } from "@ethernauta/chain/eip155-666666666"
import { eip155_1380012617 } from "@ethernauta/chain/eip155-1380012617"
import {
  type ChainId,
  encode_chain_id,
} from "@ethernauta/transport"
import type { ArbitrumDeploys } from "../core/deploys"
import { eip155_1729_deploys } from "../deploys/eip155-1729"
import { eip155_1996_deploys } from "../deploys/eip155-1996"
import { eip155_2187_deploys } from "../deploys/eip155-2187"
import { eip155_2911_deploys } from "../deploys/eip155-2911"
import { eip155_7887_deploys } from "../deploys/eip155-7887"
import { eip155_33139_deploys } from "../deploys/eip155-33139"
import { eip155_41455_deploys } from "../deploys/eip155-41455"
import { eip155_42161_deploys } from "../deploys/eip155-42161"
import { eip155_42170_deploys } from "../deploys/eip155-42170"
import { eip155_70700_deploys } from "../deploys/eip155-70700"
import { eip155_98865_deploys } from "../deploys/eip155-98865"
import { eip155_111188_deploys } from "../deploys/eip155-111188"
import { eip155_421614_deploys } from "../deploys/eip155-421614"
import { eip155_660279_deploys } from "../deploys/eip155-660279"
import { eip155_10241024_deploys } from "../deploys/eip155-10241024"
import { eip155_21000000_deploys } from "../deploys/eip155-21000000"
import { eip155_666666666_deploys } from "../deploys/eip155-666666666"
import { eip155_1380012617_deploys } from "../deploys/eip155-1380012617"

const DEPLOYS: Record<ChainId, ArbitrumDeploys> = {
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_42161.chainId,
  })]: eip155_42161_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_42170.chainId,
  })]: eip155_42170_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_421614.chainId,
  })]: eip155_421614_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_660279.chainId,
  })]: eip155_660279_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_33139.chainId,
  })]: eip155_33139_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_1996.chainId,
  })]: eip155_1996_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_70700.chainId,
  })]: eip155_70700_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_1380012617.chainId,
  })]: eip155_1380012617_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_1729.chainId,
  })]: eip155_1729_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_98865.chainId,
  })]: eip155_98865_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_666666666.chainId,
  })]: eip155_666666666_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_2187.chainId,
  })]: eip155_2187_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_2911.chainId,
  })]: eip155_2911_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_10241024.chainId,
  })]: eip155_10241024_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_7887.chainId,
  })]: eip155_7887_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_41455.chainId,
  })]: eip155_41455_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_111188.chainId,
  })]: eip155_111188_deploys,
  [encode_chain_id({
    namespace: "eip155",
    reference: eip155_21000000.chainId,
  })]: eip155_21000000_deploys,
}

export function require_deploy_addresses(
  chain_id: ChainId,
): ArbitrumDeploys {
  const deploys = DEPLOYS[chain_id]
  if (!deploys) {
    throw new Error(
      `not an arbitrum-family chain: chain_id=${chain_id}`,
    )
  }
  return deploys
}
