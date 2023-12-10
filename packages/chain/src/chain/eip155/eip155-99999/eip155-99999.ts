import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_99999: Chain = {
  name: "UB Smart Chain",
  shortName: "usc",
  chain: "USC",
  rpc: [
    "https://rpc.uschain.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "UBC",
    symbol: "UBC",
    decimals: 18,
  },
  infoURL: "https://www.ubchain.site/",
  chainId: 99999,
  networkId: 99999,
}
