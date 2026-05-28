import type { Chain } from "../shared"

export const eip155_7991 = {
  name: "Peeryn",
  shortName: "pyn",
  chain: "PYN",
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
    name: "Peeryn",
    symbol: "PYN",
    decimals: 18,
  },
  infoURL: "https://peeryn.com",
  chainId: 7991,
  networkId: 7991,
  explorers: [],
  status: "incubating",
} satisfies Chain
