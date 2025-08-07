// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1516 = {
  name: "Story Odyssey Testnet",
  shortName: "story-testnet",
  chain: "Story Odyssey Testnet",
  rpc: ["https://odyssey.storyrpc.io"],
  faucets: [],
  nativeCurrency: {
    name: "IP",
    symbol: "IP",
    decimals: 18,
  },
  infoURL: "https://www.story.foundation",
  chainId: 1516,
  networkId: 1516,
  explorers: [
    {
      name: "Story Odyssey Network explorer",
      url: "https://odyssey-testnet-explorer.storyscan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
