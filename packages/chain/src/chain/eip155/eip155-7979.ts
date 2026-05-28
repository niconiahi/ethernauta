import type { Chain } from "../shared"

export const eip155_7979 = {
  name: "DOS Chain",
  shortName: "dos",
  chain: "DOS",
  icon: "doschain",
  rpc: ["https://main.doschain.com"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "DOS",
    symbol: "DOS",
    decimals: 18,
  },
  infoURL: "https://doschain.com",
  chainId: 7979,
  networkId: 7979,
  explorers: [
    {
      name: "DOScan",
      url: "https://doscan.io",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
