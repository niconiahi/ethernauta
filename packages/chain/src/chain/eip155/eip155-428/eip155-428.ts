import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_428: Chain = {
  name: "Geso Verse",
  shortName: "GSV",
  chain: "Geso Verse",
  icon: "gesoten",
  rpc: [
    "https://rpc.verse.gesoten.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://gesoten.com/",
  chainId: 428,
  networkId: 428,
  explorers: [
    {
      name: "Geso Verse Explorer",
      url: "https://explorer.verse.gesoten.com",
      standard: "EIP3091",
    },
  ],
}
