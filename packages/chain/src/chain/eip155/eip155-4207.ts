// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4207 = {
  name: "Layer Edge Mainnet",
  shortName: "LayerEdge",
  title: "EDGEN",
  chain: "EDGEN",
  icon: "edgen",
  rpc: [
    "https://layeredge-mainnet-evm.itrocket.net",
    "https://layeredge.rpc.subquery.network/public",
    "https://rpc.layeredge.io",
    "https://rpc.layeredge.foundation",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Layer Edge",
    symbol: "EDGEN",
    decimals: 18,
  },
  infoURL: "https://layeredge.io",
  chainId: 4207,
  networkId: 4207,
  explorers: [
    {
      name: "Layer Edge Explorer",
      url: "https://edgenscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
