import type { Chain } from "../shared"

export const eip155_3721 = {
  name: "Xone Mainnet",
  shortName: "XOC",
  chain: "XOC",
  icon: "xone_main",
  rpc: [
    "https://rpc.xone.org",
    "https://rpc-node-1.xone.org",
    "https://rpc-node-2.xone.org",
    "https://rpc-node-3.xone.org",
    "https://rpc-node-4.xone.org",
    "wss://rpc.xone.org",
  ],
  faucets: ["https://faucet.xone.org/"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Xone Coin",
    symbol: "XOC",
    decimals: 18,
  },
  infoURL: "https://xone.org",
  chainId: 3721,
  networkId: 3721,
  explorers: [
    {
      name: "xone_main",
      url: "https://xonescan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
