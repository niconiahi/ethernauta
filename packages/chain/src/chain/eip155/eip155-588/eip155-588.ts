import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_588: Chain = {
  name: "Metis Stardust Testnet",
  shortName: "metis-stardust",
  chain: "ETH",
  rpc: [
    "https://stardust.metis.io/?owner=588",
  ],
  faucets: [],
  nativeCurrency: {
    name: "tMetis",
    symbol: "METIS",
    decimals: 18,
  },
  infoURL: "https://www.metis.io",
  chainId: 588,
  networkId: 588,
  explorers: [
    {
      name: "blockscout",
      url: "https://stardust-explorer.metis.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-4",
    bridges: [
      {
        url: "https://bridge.metis.io",
      },
    ],
  },
  status: "deprecated",
}
