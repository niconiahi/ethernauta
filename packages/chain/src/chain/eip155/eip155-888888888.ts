// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_888888888 = {
  name: "Ancient8",
  shortName: "ancient8",
  chain: "Ancient8",
  icon: "ancient8",
  rpc: ["https://rpc.ancient8.gg"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ancient8.gg/",
  chainId: 888888888,
  networkId: 888888888,
  explorers: [
    {
      name: "Ancient8 Explorer",
      url: "https://scan.ancient8.gg",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
