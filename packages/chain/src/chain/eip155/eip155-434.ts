import type { Chain } from "../shared"

export const eip155_434 = {
  name: "Boyaa",
  shortName: "BYC",
  chain: "BYC",
  icon: "boyaanetwork",
  rpc: ["https://rpc.boyaa.network"],
  faucets: [],
  nativeCurrency: {
    name: "Boyaa native coin",
    symbol: "BYC",
    decimals: 18,
  },
  infoURL: "https://boyaa.network",
  chainId: 434,
  networkId: 434,
  explorers: [
    {
      name: "Boyaa explorer",
      url: "https://explorer.boyaa.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
