// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3366 = {
  name: "Meroneum",
  shortName: "meron-testnet",
  chain: "MERON",
  icon: "meron",
  rpc: [
    "https://mainnet-node1.meronscan.ai/",
    "https://mainnet-node2.meronscan.ai/",
    "https://mainnet-node3.meronscan.ai/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MERON",
    symbol: "MERON",
    decimals: 18,
  },
  infoURL: "https://www.meroneum.ai",
  chainId: 3366,
  networkId: 3366,
  explorers: [
    {
      name: "meronscan",
      url: "https://meronscan.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
