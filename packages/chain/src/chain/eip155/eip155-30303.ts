import type { Chain } from "../shared"

export const eip155_30303 = {
  name: "Ethiq",
  shortName: "ethiq",
  chain: "ETH",
  rpc: [
    "https://rpc.ethiq.network",
    "wss://rpc.ethiq.network",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
    {
      name: "EIP2718",
    },
    {
      name: "EIP2930",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.ethiq.network",
  chainId: 30303,
  networkId: 30303,
  explorers: [
    {
      name: "Ethiq Blockscout",
      url: "https://explorer.ethiq.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://shell.haqq.network/bridge",
      },
    ],
  },
} satisfies Chain
