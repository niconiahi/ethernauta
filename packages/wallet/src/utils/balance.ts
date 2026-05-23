import type { Address } from "@ethernauta/core"
import { eth_getBalance } from "@ethernauta/eth"
import { signal } from "@preact/signals"
import { get_reader, selected_chain } from "./chain"
import { hex_to_big } from "./crypto"

export const balance = signal<bigint>(0n)

export async function fetch_balance(address: Address) {
  const { chain_id, reader } = get_reader(
    selected_chain.value,
  )
  const readable = eth_getBalance([address, "latest"])
  const result = await readable(reader({ chain_id }))
  return hex_to_big(result)
}
