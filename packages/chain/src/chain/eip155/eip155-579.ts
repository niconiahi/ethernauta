// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_579 = {
  name: "Filenova Mainnet",
  shortName: "filenova",
  chain: "Filenova",
  icon: "filenova",
  rpc: ["https://rpc.filenova.org"],
  faucets: [],
  nativeCurrency: {
    name: "Filecoin",
    symbol: "FIL",
    decimals: 18,
  },
  infoURL: "https://filenova.org",
  chainId: 579,
  networkId: 579,
  explorers: [
    {
      name: "filenova explorer",
      url: "https://scan.filenova.org",
      standard: "none",
    },
  ],
} satisfies Chain
