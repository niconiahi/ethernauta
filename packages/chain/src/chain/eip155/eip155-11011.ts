// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11011 = {
  name: "Shape Sepolia Testnet",
  shortName: "shapesep",
  chain: "ETH",
  icon: "shapeTestnet",
  rpc: ["https://sepolia.shape.network"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://shape.network",
  chainId: 11011,
  networkId: 11011,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer-sepolia.shape.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
