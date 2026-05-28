import type { Chain } from "../shared"

export const eip155_21211 = {
  name: "1Money Sidechain Mainnet",
  shortName: "1money-sc",
  chain: "1MoneySidechain",
  icon: "1moneynetwork",
  rpc: [
    "https://rpc.sidechain.mainnet.1money.network",
    "https://rpc1.sidechain.mainnet.1money.network",
    "https://rpc2.sidechain.mainnet.1money.network",
    "https://rpc3.sidechain.mainnet.1money.network",
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
  chainId: 21211,
  networkId: 21211,
  explorers: [],
} satisfies Chain
