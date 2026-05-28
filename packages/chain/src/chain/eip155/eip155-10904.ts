import type { Chain } from "../shared"

export const eip155_10904 = {
  name: "Ault Blockchain Testnet",
  shortName: "ault-testnet",
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
    name: "Testnet AULT Token",
    symbol: "AULT",
    decimals: 18,
  },
  infoURL: "https://aultblockchain.com",
  chainId: 10904,
  networkId: 10904,
  explorers: [],
} satisfies Chain
