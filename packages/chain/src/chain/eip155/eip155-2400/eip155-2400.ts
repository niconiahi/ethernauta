import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2400: Chain = {
  name: "TCG Verse Mainnet",
  shortName: "TCGV",
  chain: "TCG Verse",
  icon: "tcg_verse",
  rpc: [
    "https://rpc.tcgverse.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://tcgverse.xyz/",
  chainId: 2400,
  networkId: 2400,
  explorers: [
    {
      name: "TCG Verse Explorer",
      url: "https://explorer.tcgverse.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-248",
  },
}
