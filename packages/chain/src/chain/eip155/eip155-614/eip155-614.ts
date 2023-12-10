import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_614: Chain = {
  name: "Graphlinq Blockchain Mainnet",
  shortName: "glq",
  chain: "GLQ Blockchain",
  rpc: [
    "https://glq-dataseed.graphlinq.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "GLQ",
    symbol: "GLQ",
    decimals: 18,
  },
  infoURL: "https://graphlinq.io",
  chainId: 614,
  networkId: 614,
  explorers: [
    {
      name: "GLQ Explorer",
      url: "https://explorer.graphlinq.io",
      standard: "none",
    },
  ],
}
