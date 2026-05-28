import type { Chain } from "../shared"

export const eip155_5069 = {
  name: "Danny",
  shortName: "dan",
  title: "Danny",
  chain: "DAN",
  icon: "danny",
  rpc: ["https://rpc.dannyscan.com"],
  faucets: [],
  nativeCurrency: {
    name: "Danny",
    symbol: "DAN",
    decimals: 18,
  },
  infoURL: "https://dannychain.com",
  chainId: 5069,
  networkId: 5069,
  explorers: [
    {
      name: "Dannyscan",
      url: "https://dannyscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
