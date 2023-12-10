import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_22023: Chain = {
  name: "Taycan",
  shortName: "SFL",
  chain: "Taycan",
  icon: "shuffle",
  rpc: [
    "https://taycan-rpc.hupayx.io:8545",
  ],
  faucets: [],
  nativeCurrency: {
    name: "shuffle",
    symbol: "SFL",
    decimals: 18,
  },
  infoURL: "https://hupayx.io",
  chainId: 22023,
  networkId: 22023,
  explorers: [
    {
      name: "Taycan Explorer(Blockscout)",
      url: "https://taycan-evmscan.hupayx.io",
      standard: "none",
    },
    {
      name: "Taycan Cosmos Explorer(BigDipper)",
      url: "https://taycan-cosmoscan.hupayx.io",
      standard: "none",
    },
  ],
}
