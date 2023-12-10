import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2: Chain = {
  name: "Expanse Network",
  shortName: "exp",
  chain: "EXP",
  rpc: [
    "https://node.expanse.tech",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Expanse Network Ether",
    symbol: "EXP",
    decimals: 18,
  },
  infoURL: "https://expanse.tech",
  chainId: 2,
  networkId: 1,
  slip44: 40,
}
