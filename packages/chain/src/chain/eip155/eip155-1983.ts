import type { Chain } from "../shared"

export const eip155_1983 = {
  name: "Krown Mainnet",
  shortName: "krown",
  chain: "KROWN",
  icon: "krown",
  rpc: [
    "https://mainnet.krown.network",
    "https://mainnet1.krown.network",
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
    name: "KROWN",
    symbol: "KROWN",
    decimals: 18,
  },
  infoURL: "https://krown.network",
  chainId: 1983,
  networkId: 1983,
  explorers: [
    {
      name: "Krown Explorer",
      url: "https://explorer.krown.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
