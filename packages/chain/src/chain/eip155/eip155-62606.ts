import type { Chain } from "../shared"

export const eip155_62606 = {
  name: "Apollo Mainnet",
  shortName: "APOLLO",
  chain: "APOLLO",
  icon: "apollo",
  rpc: ["https://mainnet-rpc.apolloscan.io"],
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
    name: "Apollo",
    symbol: "APOLLO",
    decimals: 18,
  },
  infoURL: "https://docs.apolloscan.io",
  chainId: 62606,
  networkId: 62606,
  explorers: [
    {
      name: "Apollo Mainnet",
      url: "https://apolloscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
