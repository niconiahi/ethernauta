import type { Chain } from "../shared"

export const eip155_1212111 = {
  name: "1Money Sidechain Testnet",
  shortName: "1money-sc-testnet",
  chain: "1MoneySidechain",
  icon: "1moneynetwork",
  rpc: [
    "https://rpc.sidechain.testnet.1money.network",
    "https://rpc1.sidechain.testnet.1money.network",
    "https://rpc2.sidechain.testnet.1money.network",
    "https://rpc3.sidechain.testnet.1money.network",
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
    name: "FREE",
    symbol: "FREE",
    decimals: 18,
  },
  infoURL: "https://www.1moneynetwork.com",
  chainId: 1212111,
  networkId: 1212111,
  explorers: [],
} satisfies Chain
