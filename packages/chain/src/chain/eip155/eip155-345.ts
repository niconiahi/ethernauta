// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_345 = {
  name: "TSC Mainnet",
  shortName: "TSC",
  chain: "Trust Smart Chain",
  icon: "netx",
  rpc: ["https://rpc01.trias.one"],
  faucets: [],
  nativeCurrency: {
    name: "TAS",
    symbol: "TAS",
    decimals: 18,
  },
  infoURL: "https://www.trias.one",
  chainId: 345,
  networkId: 16,
  explorers: [
    {
      name: "tscscan",
      url: "https://www.tscscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
