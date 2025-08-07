// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_24816 = {
  name: "Recall",
  shortName: "recall",
  chain: "Recall",
  rpc: ["https://evm.node-0.mainnet.recall.network"],
  faucets: [],
  nativeCurrency: {
    name: "Recall",
    symbol: "RECALL",
    decimals: 18,
  },
  infoURL: "https://recall.network",
  chainId: 24816,
  networkId: 24816,
  explorers: [],
} satisfies Chain
