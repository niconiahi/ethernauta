// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11221 = {
  name: "Shine Chain",
  shortName: "SC20",
  chain: "SC20",
  icon: "shine",
  rpc: ["https://rpc.shinescan.io"],
  faucets: [],
  nativeCurrency: {
    name: "Shine",
    symbol: "SC20",
    decimals: 18,
  },
  infoURL: "https://shinechain.tech",
  chainId: 11221,
  networkId: 11221,
  explorers: [
    {
      name: "shinescan",
      url: "https://shinescan.io",
      standard: "none",
    },
  ],
} satisfies Chain
