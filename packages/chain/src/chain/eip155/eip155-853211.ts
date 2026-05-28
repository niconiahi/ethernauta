import type { Chain } from "../shared"

export const eip155_853211 = {
  name: "Testethiq",
  shortName: "testethiq",
  chain: "ETH",
  rpc: [
    "https://rpc.testnet.ethiq.network",
    "wss://rpc.testnet.ethiq.network",
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
  chainId: 853211,
  networkId: 853211,
  explorers: [
    {
      name: "Ethiq Blockscout",
      url: "https://explorer.testnet.ethiq.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://shell.haqq.network/bridge",
      },
    ],
  },
} satisfies Chain
