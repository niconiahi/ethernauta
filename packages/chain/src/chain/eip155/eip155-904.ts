import type { Chain } from "../shared"

export const eip155_904 = {
  name: "Ault Blockchain Mainnet",
  shortName: "ault",
  chain: "AULT",
  icon: "ault",
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
    name: "AULT Token",
    symbol: "AULT",
    decimals: 18,
  },
  infoURL: "https://aultblockchain.com",
  chainId: 904,
  networkId: 904,
  explorers: [],
} satisfies Chain
