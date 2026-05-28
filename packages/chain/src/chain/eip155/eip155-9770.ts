import type { Chain } from "../shared"

export const eip155_9770 = {
  name: "Nepachain",
  shortName: "Nepachain",
  chain: "Nepachain",
  rpc: [
    "https://network.nepachain.org",
    "https://network.nepachain.com",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
    {
      name: "EIP2930",
    },
  ],
  nativeCurrency: {
    name: "Nepacoin",
    symbol: "NPC",
    decimals: 18,
  },
  infoURL: "https://docs.nepachain.org/",
  chainId: 9770,
  networkId: 9770,
  explorers: [],
} satisfies Chain
