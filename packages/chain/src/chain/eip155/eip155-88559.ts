// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_88559 = {
  name: "InoAi",
  shortName: "INO",
  chain: "INOAI",
  icon: "inoai",
  rpc: ["https://inoai-network.com"],
  faucets: [],
  nativeCurrency: {
    name: "InoAi",
    symbol: "INO",
    decimals: 18,
  },
  infoURL: "https://docs.inoai.info/",
  chainId: 88559,
  networkId: 88559,
  explorers: [
    {
      name: "inoai.live",
      url: "https://inoai.live",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
