import type { Chain } from "../shared"

export const eip155_1155 = {
  name: "Intuition Mainnet",
  shortName: "intuition",
  chain: "TRUST",
  icon: "intuition",
  rpc: ["https://rpc.intuition.systems"],
  faucets: [],
  nativeCurrency: {
    name: "TRUST",
    symbol: "TRUST",
    decimals: 18,
  },
  infoURL: "https://intuition.systems",
  chainId: 1155,
  networkId: 1155,
  explorers: [
    {
      name: "Intuition Explorer",
      url: "https://explorer.intuition.systems",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-8453",
  },
} satisfies Chain
