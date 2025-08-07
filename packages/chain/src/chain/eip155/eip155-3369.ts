// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3369 = {
  name: "Meroneum Testnet",
  shortName: "meron",
  chain: "MERON",
  icon: "meron",
  rpc: [
    "https://testnet-node1.meronscan.ai/",
    "https://testnet-node2.meronscan.ai/",
    "https://testnet-node3.meronscan.ai/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MERON",
    symbol: "MERON",
    decimals: 18,
  },
  infoURL: "https://www.meroneum.ai/",
  chainId: 3369,
  networkId: 3369,
  explorers: [
    {
      name: "meronscan",
      url: "https://testnet.meronscan.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
