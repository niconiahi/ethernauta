import type { Chain } from "../shared"

export const eip155_13113 = {
  name: "RANNTA X-Chain",
  shortName: "rntx",
  chain: "RANNTA",
  icon: "rannta",
  rpc: ["https://rpc.rannta.com"],
  faucets: [],
  nativeCurrency: {
    name: "RANNTA Core X",
    symbol: "RNTX",
    decimals: 18,
  },
  infoURL: "https://rannta.com",
  chainId: 13113,
  networkId: 13113,
  explorers: [
    {
      name: "RANNTA X-Chain Explorer",
      url: "https://explorer.rannta.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
