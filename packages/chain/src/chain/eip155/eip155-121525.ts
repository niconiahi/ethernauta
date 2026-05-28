import type { Chain } from "../shared"

export const eip155_121525 = {
  name: "Ethernova Mainnet",
  shortName: "ethnova",
  chain: "NOVA",
  rpc: ["https://rpc.ethnova.net"],
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
    name: "Ethernova",
    symbol: "NOVA",
    decimals: 18,
  },
  infoURL: "https://ethnova.net",
  chainId: 121525,
  networkId: 121525,
  explorers: [
    {
      name: "Ethernova Explorer",
      url: "https://explorer.ethnova.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
