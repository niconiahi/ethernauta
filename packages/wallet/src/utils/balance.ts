import { eip155_11155111 } from "@ethernauta/chain"
import {
  type Address,
  eth_getBalance,
} from "@ethernauta/eth"
import {
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { signal } from "@preact/signals"
import { hex_to_big } from "./crypto"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://ethereum-sepolia-rpc.publicnode.com"
const sepolia_chain_id = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const reader = create_reader([
  {
    chainId: sepolia_chain_id,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

export const balance = signal<bigint>(0n)

export async function fetch_balance(address: Address) {
  const readable = eth_getBalance([address, "latest"])
  console.log("readable", readable)
  const balance = await readable(reader(sepolia_chain_id))
  return hex_to_big(balance)
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
