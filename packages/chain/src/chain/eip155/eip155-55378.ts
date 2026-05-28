import type { Chain } from "../shared"

export const eip155_55378 = {
  name: "DUST Mainnet",
  shortName: "dust-mainnet",
  chain: "ETH",
  icon: "dust",
  rpc: [
    "https://rpc.dustproject.org",
    "wss://rpc.dustproject.org",
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://dustproject.org",
  chainId: 55378,
  networkId: 55378,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.dustproject.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [],
  },
} satisfies Chain
