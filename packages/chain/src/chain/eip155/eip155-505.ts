import type { Chain } from "../shared"

export const eip155_505 = {
  name: "DotOne Smart Chain",
  shortName: "doto",
  chain: "DOTO",
  icon: "dotonechain",
  rpc: ["https://rpc.dotone.network"],
  faucets: [],
  nativeCurrency: {
    name: "Doto",
    symbol: "DOTO",
    decimals: 18,
  },
  infoURL: "https://dotone.network",
  chainId: 505,
  networkId: 505,
  explorers: [
    {
      name: "DotOne Smart Chain Explorer",
      url: "https://explorer.dotone.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
