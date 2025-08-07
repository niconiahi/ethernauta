// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_120893 = {
  name: "Sova Sepolia Testnet",
  shortName: "sovasep",
  chain: "ETH",
  icon: "sova",
  rpc: ["https://rpc.testnet.sova.io"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://sova.io",
  chainId: 120893,
  networkId: 120893,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.testnet.sova.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
