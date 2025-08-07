// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_706883 = {
  name: "Fidesinnova",
  shortName: "Fidesinnova",
  chain: "Fidesinnova",
  rpc: ["https://rpc1.fidesinnova.io"],
  faucets: [],
  nativeCurrency: {
    name: "Fidesinnova",
    symbol: "FDS",
    decimals: 18,
  },
  infoURL: "https://fidesinnova.gitbook.io/docs",
  chainId: 706883,
  networkId: 706883,
  explorers: [
    {
      name: "Fidesinnova Blockchain Explorer",
      url: "https://explorer.fidesinnova.io",
      standard: "none",
    },
  ],
} satisfies Chain
