// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_55007 = {
  name: "Titan Sepolia",
  shortName: "titan-sepolia",
  chain: "ETH",
  rpc: [
    "https://rpc.titan-sepolia.tokamak.network",
    "wss://rpc.titan-sepolia.tokamak.network/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://tokamak.network",
  chainId: 55007,
  networkId: 55007,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.titan-sepolia.tokamak.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
