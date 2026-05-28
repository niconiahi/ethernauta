import type { Chain } from "../shared"

export const eip155_237 = {
  name: "AEREDIUM",
  shortName: "aer",
  chain: "AER",
  icon: "aeredium",
  rpc: ["https://rpc.aeredium.io"],
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
    name: "AER",
    symbol: "AER",
    decimals: 18,
  },
  infoURL: "https://aeredium.io",
  chainId: 237,
  networkId: 237,
  explorers: [
    {
      name: "AEREDIUM Explorer",
      url: "https://explorer.aeredium.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
