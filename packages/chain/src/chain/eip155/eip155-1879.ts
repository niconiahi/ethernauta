import type { Chain } from "../shared"

export const eip155_1879 = {
  name: "XGR Testnet",
  shortName: "xgrt",
  chain: "XGR",
  icon: "xgr",
  rpc: [
    "https://rpc.testnet.xgr.network",
    "https://rpc1.testnet.xgr.network",
    "https://rpc2.testnet.xgr.network",
  ],
  faucets: ["https://faucet.xgr.network"],
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
  chainId: 1879,
  networkId: 1879,
  explorers: [
    {
      name: "XGRScan",
      url: "https://explorer.testnet.xgr.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
