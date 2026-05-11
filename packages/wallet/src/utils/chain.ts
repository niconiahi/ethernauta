import { eip155_11155111 } from "@ethernauta/chain"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { signal } from "@preact/signals"

export type Chain = {
  id: number
  name: string
  rpc_url: string
}

export const CHAINS: Chain[] = [
  {
    id: eip155_11155111.chainId,
    name: eip155_11155111.name,
    rpc_url: "https://ethereum-sepolia-rpc.publicnode.com",
  },
]

export const selected_chain = signal<Chain>(CHAINS[0]!)

const NAMESPACE = "eip155"

export function get_chain_id(chain: Chain) {
  return encode_chain_id({
    namespace: NAMESPACE,
    reference: chain.id,
  })
}

export function get_reader(chain: Chain) {
  const chain_id = get_chain_id(chain)
  return {
    chain_id,
    reader: create_reader([
      {
        chainId: chain_id,
        transports: [http(chain.rpc_url)],
      },
    ]),
  }
}
