// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10222 = {
  name: "GLScan",
  shortName: "glc",
  chain: "GLC",
  icon: "glc",
  rpc: ["https://glc-dataseed.glscan.io/"],
  faucets: [],
  nativeCurrency: {
    name: "GLC",
    symbol: "GLC",
    decimals: 18,
  },
  infoURL: "https://glscan.io/",
  chainId: 10222,
  networkId: 10222,
  slip44: 1,
  explorers: [
    {
      name: "GLScan Explorer",
      url: "https://glscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
