import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_803: Chain = {
  name: "Haic",
  shortName: "haic",
  chain: "Haic",
  rpc: [
    "https://orig.haichain.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Haicoin",
    symbol: "HAIC",
    decimals: 18,
  },
  infoURL: "https://www.haichain.io/",
  chainId: 803,
  networkId: 803,
}
