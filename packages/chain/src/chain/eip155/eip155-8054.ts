// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8054 = {
  name: "Karak Sepolia",
  shortName: "karak-sepolia",
  title: "Karak Testnet Sepolia",
  chain: "Karak",
  icon: "karak",
  rpc: ["https://rpc.sepolia.karak.network"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://karak.network",
  chainId: 8054,
  networkId: 8054,
  explorers: [
    {
      name: "Karak Sepolia Explorer",
      url: "https://explorer.sepolia.karak.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
} satisfies Chain
