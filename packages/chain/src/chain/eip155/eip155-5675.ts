// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5675 = {
  name: "Filenova Testnet",
  shortName: "tfilenova",
  chain: "Filenova",
  icon: "filenova",
  rpc: ["https://rpctest.filenova.org"],
  faucets: [],
  nativeCurrency: {
    name: "Test Filecoin",
    symbol: "tFIL",
    decimals: 18,
  },
  infoURL: "https://filenova.org",
  chainId: 5675,
  networkId: 5675,
  explorers: [
    {
      name: "filenova testnet explorer",
      url: "https://scantest.filenova.org",
      standard: "none",
    },
  ],
} satisfies Chain
