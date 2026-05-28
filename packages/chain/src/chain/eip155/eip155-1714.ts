import type { Chain } from "../shared"

export const eip155_1714 = {
  name: "ACiD",
  shortName: "acid",
  chain: "ACID",
  rpc: [],
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://github.com/NoBanks/ACiD",
  chainId: 1714,
  networkId: 1714,
  explorers: [],
  status: "incubating",
} satisfies Chain
