import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_333999: Chain = {
  name: "Polis Mainnet",
  shortName: "olympus",
  chain: "Olympus",
  icon: "polis",
  rpc: [
    "https://rpc.polis.tech",
  ],
  faucets: [
    "https://faucet.polis.tech",
  ],
  nativeCurrency: {
    name: "Polis",
    symbol: "POLIS",
    decimals: 18,
  },
  infoURL: "https://polis.tech",
  chainId: 333999,
  networkId: 333999,
}
