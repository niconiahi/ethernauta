import type { Chain } from "../shared"

export const eip155_45056 = {
  name: "Billions",
  shortName: "Billions",
  title: "Billions",
  chain: "Billions",
  icon: "billions",
  rpc: ["https://billions-rpc.eu-north-2.gateway.fm"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "ETHER",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://billions.network",
  chainId: 45056,
  networkId: 45056,
  explorers: [
    {
      name: "Billions Explorer",
      url: "https://billions-blockscout.eu-north-2.gateway.fm",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://billions-bridge.eu-north-2.gateway.fm",
      },
    ],
  },
  status: "active",
} satisfies Chain
