import type { Chain } from "../shared"

export const eip155_1342 = {
  name: "BIE",
  shortName: "bie",
  chain: "BIE",
  icon: "bie",
  rpc: ["https://rpc.bie.ai", "https://api.bie.ai"],
  faucets: ["https://app.bie.ai/faucet"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "BIE",
    symbol: "BIE",
    decimals: 18,
  },
  infoURL: "https://bie.ai",
  chainId: 1342,
  networkId: 1342,
  explorers: [
    {
      name: "BIE Explorer",
      url: "https://app.bie.ai/explorer",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
