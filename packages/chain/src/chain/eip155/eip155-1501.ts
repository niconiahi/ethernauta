// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1501 = {
  name: "BEVM Canary",
  shortName: "chainx",
  chain: "ChainX",
  icon: "bevmcanary",
  rpc: [
    "https://rpc-canary-1.bevm.io/",
    "https://rpc-canary-2.bevm.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://chainx.org",
  chainId: 1501,
  networkId: 1501,
  explorers: [
    {
      name: "bevm canary scan",
      url: "https://scan-canary.bevm.io",
      standard: "none",
    },
  ],
} satisfies Chain
