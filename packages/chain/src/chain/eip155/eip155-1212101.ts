import type { Chain } from "../shared"

export const eip155_1212101 = {
  name: "1Money Network Testnet",
  shortName: "1money-testnet",
  chain: "1MoneyNetwork",
  icon: "1moneynetwork",
  rpc: [
    "https://rpc.testnet.1money.network",
    "https://rpc1.testnet.1money.network",
    "https://rpc2.testnet.1money.network",
    "https://rpc3.testnet.1money.network",
  ],
  faucets: ["https://www.1moneynetwork.com/faucet"],
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
  chainId: 1212101,
  networkId: 1212101,
  explorers: [
    {
      name: "1Money Network Explorer",
      url: "https://www.1moneynetwork.com/explorer?network=testnet",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
