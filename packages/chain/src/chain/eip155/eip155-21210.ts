import type { Chain } from "../shared"

export const eip155_21210 = {
  name: "1Money Network Mainnet",
  shortName: "1money",
  chain: "1MoneyNetwork",
  icon: "1moneynetwork",
  rpc: [
    "https://rpc.mainnet.1money.network",
    "https://rpc1.mainnet.1money.network",
    "https://rpc2.mainnet.1money.network",
    "https://rpc3.mainnet.1money.network",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "FREE",
    symbol: "FREE",
    decimals: 18,
  },
  infoURL: "https://www.1moneynetwork.com",
  chainId: 21210,
  networkId: 21210,
  explorers: [
    {
      name: "1Money Network Explorer",
      url: "https://www.1moneynetwork.com/explorer",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
