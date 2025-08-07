// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5656 = {
  name: "QIE Blockchain",
  shortName: "QIE",
  chain: "QIE",
  icon: "qie",
  rpc: [
    "https://rpc-main1.qiblockchain.online/",
    "https://rpc-main2.qiblockchain.online/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "QIE Blockchain",
    symbol: "QIE",
    decimals: 18,
  },
  infoURL: "https://qiblockchain.online/",
  chainId: 5656,
  networkId: 5656,
  explorers: [
    {
      name: "QIE Explorer",
      url: "https://mainnet.qiblockchain.online",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
