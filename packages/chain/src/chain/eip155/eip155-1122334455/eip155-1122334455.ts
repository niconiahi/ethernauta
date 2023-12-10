import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1122334455: Chain = {
  name: "IPOS Network",
  shortName: "ipos",
  chain: "IPOS",
  rpc: [
    "https://rpc.iposlab.com",
    "https://rpc2.iposlab.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "IPOS Network Ether",
    symbol: "IPOS",
    decimals: 18,
  },
  infoURL: "https://iposlab.com",
  chainId: 1122334455,
  networkId: 1122334455,
}
