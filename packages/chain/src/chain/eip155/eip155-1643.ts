import type { Chain } from "../shared"

export const eip155_1643 = {
  name: "XGR Mainnet",
  shortName: "xgr",
  chain: "XGR",
  icon: "xgr",
  rpc: [
    "https://rpc.xgr.network",
    "https://rpc1.xgr.network",
    "https://rpc2.xgr.network",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "XGR",
    symbol: "XGR",
    decimals: 18,
  },
  infoURL: "https://xgr.network",
  chainId: 1643,
  networkId: 1643,
  explorers: [
    {
      name: "XGRScan",
      url: "https://explorer.xgr.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
