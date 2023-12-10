import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1246: Chain = {
  name: "OM Platform Mainnet",
  shortName: "om",
  chain: "omplatform",
  rpc: [
    "https://rpc-cnx.omplatform.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OMCOIN",
    symbol: "OM",
    decimals: 18,
  },
  infoURL: "https://omplatform.com/",
  chainId: 1246,
  networkId: 1246,
  explorers: [
    {
      name: "OMSCAN - Expenter",
      url: "https://omscan.omplatform.com",
      standard: "none",
    },
  ],
}
