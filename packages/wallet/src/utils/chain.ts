import {
  eip155_1,
  eip155_11155111,
} from "@ethernauta/chain"
import {
  create_reader,
  create_writer,
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
  {
    id: eip155_1.chainId,
    name: eip155_1.name,
    rpc_url: "https://ethereum-rpc.publicnode.com",
  },
]

// biome-ignore lint/style/noNonNullAssertion: module-level CHAINS array is statically non-empty
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

export function get_writer(chain: Chain) {
  const chain_id = get_chain_id(chain)
  return {
    chain_id,
    writer: create_writer([
      {
        chainId: chain_id,
        transports: [http(chain.rpc_url)],
      },
    ]),
  }
}

export function to_provider_chain_id(
  chain: Chain,
): `0x${string}` {
  return `0x${chain.id.toString(16)}`
}

/**
 * Lookup a known chain by its numeric id. Returns undefined
 * when the wallet doesn't know about the chain — caller is
 * responsible for the "unknown chain" UX.
 */
export function get_chain(id: number): Chain | undefined {
  return CHAINS.find((chain) => chain.id === id)
}

/**
 * Activate a chain — updates the popup's selected_chain
 * signal AND fires a notification the page-context
 * provider listens for, so it can call
 * provider.set_active_chain (which emits `chainChanged`
 * to every connected dapp).
 */
export function select_chain(chain: Chain): void {
  selected_chain.value = chain
  chrome.runtime.sendMessage({
    type: "ETHERNAUTA_NOTIFICATION_CHAIN_SELECTED",
    chainId: to_provider_chain_id(chain),
  })
}

/**
 * Parse user input into a numeric chain id. Accepts:
 *  - decimal: "1"
 *  - hex:     "0x1"
 *  - CAIP-2:  "eip155:1"
 *
 * Returns undefined when the input doesn't match any of
 * those shapes.
 */
export function parse_chain_input(
  input: string,
): number | undefined {
  const trimmed = input.trim()
  if (trimmed === "") return undefined
  const caip = /^eip155:(\d+)$/.exec(trimmed)
  if (caip) return Number(caip[1])
  if (/^0x[0-9a-fA-F]+$/.test(trimmed))
    return Number.parseInt(trimmed.slice(2), 16)
  if (/^\d+$/.test(trimmed)) return Number(trimmed)
  return undefined
}
