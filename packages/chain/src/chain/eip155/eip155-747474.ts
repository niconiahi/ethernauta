// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_747474 = {
  name: "katana",
  shortName: "katana",
  chain: "katana",
  icon: "katana",
  rpc: ["https://rpc.katana.network"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://katana.network",
  chainId: 747474,
  networkId: 747474,
  explorers: [
    {
      name: "katana explorer",
      url: "https://explorer.katanarpc.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
