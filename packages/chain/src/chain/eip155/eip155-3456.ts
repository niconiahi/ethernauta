// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3456 = {
  name: "LayerEdge testnet",
  shortName: "LayerEdge-testnet",
  chain: "LayerEdge",
  icon: "layerEdge",
  rpc: ["https://testnet-rpc.layeredge.io"],
  faucets: ["https://testnet-faucet.layeredge.io"],
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://www.layeredge.io",
  chainId: 3456,
  networkId: 3456,
  explorers: [
    {
      name: "LayerEdge Testnet Explorer",
      url: "https://testnet-explorer.layeredge.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
