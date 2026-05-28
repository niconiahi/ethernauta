import type { Chain } from "../shared"

export const eip155_747474 = {
  name: "katana",
  shortName: "katana",
  chain: "katana",
  icon: "katana",
  rpc: [
    "https://rpc.katana.network",
    "https://katana.gateway.tenderly.co/",
    "https://rpc.katanarpc.com/",
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
      name: "EIP4844",
    },
    {
      name: "EIP7702",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://katana.network",
  chainId: 747474,
  networkId: 747474,
  explorers: [
    {
      name: "katanascan",
      url: "https://katanascan.com",
      standard: "EIP3091",
    },
    {
      name: "katana explorer",
      url: "https://explorer.katanarpc.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.katana.network",
      },
    ],
  },
} satisfies Chain
