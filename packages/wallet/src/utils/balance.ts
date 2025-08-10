import { eip155_11155111 } from "@ethernauta/chain"
import {
  eth_getBalance,
  type Address,
} from "@ethernauta/eth"
import {
  createReader,
  encodeChainId,
  http,
} from "@ethernauta/transport"
import { signal } from "@preact/signals"
import { hex_to_big } from "./crypto"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://muddy-radial-borough.ethereum-sepolia.quiknode.pro/e0d1ca422dd966c7b388455f296fb1483f738bef/"
const sepolia_chain_id = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const reader = createReader([
  {
    chainId: sepolia_chain_id,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

export const balance = signal<bigint>(0n)

export async function fetch_balance(address: Address) {
  const readable = eth_getBalance([address, "latest"])
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
