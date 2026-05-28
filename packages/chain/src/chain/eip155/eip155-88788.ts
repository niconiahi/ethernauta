import type { Chain } from "../shared"

export const eip155_88788 = {
  name: "PropTech Mainnet",
  shortName: "ptek",
  chain: "PTEK",
  icon: "ptek",
  rpc: ["https://mainnet.ptekcoin.com"],
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
    name: "PropTech Token",
    symbol: "PTEK",
    decimals: 18,
  },
  infoURL: "https://ptek.ai",
  chainId: 88788,
  networkId: 88788,
  explorers: [
    {
      name: "PropTech Blockchain Explorer",
      url: "https://explorer.ptekcoin.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
