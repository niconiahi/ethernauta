import type { Chain } from "../shared"

export const eip155_510 = {
  name: "Syndicate Mainnet",
  shortName: "syndicate",
  chain: "Syndicate",
  icon: "syndicate",
  rpc: ["https://rpc.syndicate.io"],
  faucets: [],
  nativeCurrency: {
    name: "Syndicate",
    symbol: "SYND",
    decimals: 18,
  },
  infoURL: "https://syndicate.io",
  chainId: 510,
  networkId: 510,
  explorers: [
    {
      name: "Syndicate Explorer",
      url: "https://explorer.syndicate.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.arbitrum.io",
      },
    ],
  },
  status: "active",
} satisfies Chain
