import type { Chain } from "../shared"

export const eip155_1306 = {
  name: "STO Chain",
  shortName: "stoc",
  chain: "STOC",
  icon: "stoc",
  rpc: ["https://evm-stoc-mainnet.stochainscan.io"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "STOC",
    symbol: "STOC",
    decimals: 18,
  },
  infoURL: "https://www.stochain.io/",
  chainId: 1306,
  networkId: 1306,
  explorers: [
    {
      name: "STO Chain Explorer",
      url: "https://stochainscan.io/en",
      standard: "none",
    },
  ],
  status: "active",
} satisfies Chain
