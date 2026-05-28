import type { Chain } from "../shared"

export const eip155_6666689 = {
  name: "Ting Chain Testnet",
  shortName: "ting-testnet",
  title: "Ting Chain Testnet",
  chain: "tingchain",
  rpc: [
    "https://rpc-testnet.tingscan.com",
    "wss://rpc-testnet.tingscan.com",
  ],
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
    name: "Ting",
    symbol: "TING",
    decimals: 18,
  },
  infoURL: "https://tingscan.com",
  chainId: 6666689,
  networkId: 6666689,
  explorers: [
    {
      name: "TingScan",
      url: "https://testnet.tingscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
