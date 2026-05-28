import type { Chain } from "../shared"

export const eip155_55377 = {
  name: "DUST Testnet",
  shortName: "dust-testnet",
  chain: "ETH",
  icon: "dust",
  rpc: [
    "https://rpc.testnet.dustproject.org",
    "wss://rpc.testnet.dustproject.org",
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
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://dustproject.org",
  chainId: 55377,
  networkId: 55377,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.testnet.dustproject.org",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [],
  },
} satisfies Chain
