import type { Chain } from "../shared"

export const eip155_1919 = {
  name: "TurkChain",
  shortName: "turk",
  chain: "TurkChain",
  icon: "turkchain",
  rpc: ["https://rpc.turkscan.com"],
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
    name: "TC",
    symbol: "TURK",
    decimals: 18,
  },
  infoURL: "https://turkscan.com",
  chainId: 1919,
  networkId: 1919,
  explorers: [
    {
      name: "turkscan",
      url: "https://turkscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
