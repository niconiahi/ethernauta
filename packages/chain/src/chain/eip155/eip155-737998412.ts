import type { Chain } from "../shared"

export const eip155_737998412 = {
  name: "Tau Testnet",
  shortName: "tau-testnet",
  chain: "Tau",
  icon: "tau",
  rpc: ["https://rpc.tau.gateway.fm"],
  faucets: ["https://faucet.tau.gateway.fm"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "TAU",
    symbol: "TAU",
    decimals: 18,
  },
  infoURL:
    "https://presto.gateway.fm/rollups/8bd8406f-a64f-484f-b299-046dd5f24a0f",
  chainId: 737998412,
  networkId: 737998412,
  explorers: [
    {
      name: "BlockScout",
      url: "https://explorer.tau.gateway.fm",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge.tau.gateway.fm",
      },
    ],
  },
} satisfies Chain
