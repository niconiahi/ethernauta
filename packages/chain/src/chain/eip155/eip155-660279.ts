// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_660279 = {
  name: "Xai Mainnet",
  shortName: "xai",
  chain: "XAI",
  rpc: ["https://xai-chain.net/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Xai",
    symbol: "XAI",
    decimals: 18,
  },
  infoURL: "https://xai.games",
  chainId: 660279,
  networkId: 660279,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.xai-chain.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
