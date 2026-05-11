import {
  type Address,
  eth_getBalance,
} from "@ethernauta/eth"
import { signal } from "@preact/signals"
import { get_reader, selected_chain } from "./chain"
import { hex_to_big } from "./crypto"

export const balance = signal<bigint>(0n)

export async function fetch_balance(address: Address) {
  const { chain_id, reader } = get_reader(
    selected_chain.value,
  )
  const readable = eth_getBalance([address, "latest"])
  const result = await readable(reader(chain_id))
  return hex_to_big(result)
}

export function wei_to_eth(wei: bigint): string {
  const WEI_PER_ETH = 10n ** 18n
  const integer_part = wei / WEI_PER_ETH
  const fraction_part = wei % WEI_PER_ETH
  const integer = integer_part.toString()
  if (fraction_part === 0n) {
    return integer
  }
  const fraction = fraction_part
    .toString()
    .padStart(18, "0")
    .replace(/0+$/, "")
  return `${integer}.${fraction}`
}
