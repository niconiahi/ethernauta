// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1578 = {
  name: "StarCHAIN",
  shortName: "starchain",
  chain: "StarCHAIN",
  rpc: ["https://rpc.starworksglobal.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "STARX",
    symbol: "STARX",
    decimals: 18,
  },
  infoURL: "https://www.starworksglobal.com",
  chainId: 1578,
  networkId: 1578,
  explorers: [
    {
      name: "StarCHAIN Explorer",
      url: "https://starchainscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
