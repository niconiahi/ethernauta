// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1513 = {
  name: "Story Testnet",
  shortName: "Story",
  chain: "Story Testnet",
  rpc: ["https://testnet.storyrpc.io"],
  faucets: ["https://faucet.story.foundation"],
  nativeCurrency: {
    name: "IP",
    symbol: "IP",
    decimals: 18,
  },
  infoURL: "https://www.story.foundation",
  chainId: 1513,
  networkId: 1513,
  explorers: [
    {
      name: "Story Iliad Network explorer",
      url: "https://testnet.storyscan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
