// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1278060416 = {
  name: "OFFICIAL VASYL",
  shortName: "Vasyl",
  title: "OFFICIAL VASYL",
  chain: "Official-Vasyl",
  icon: "vasyl",
  rpc: ["https://rpc.official-vasyl.network"],
  faucets: ["https://faucet.official-vasyl.network"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "OFFICIAL VASYL",
    symbol: "VASYL",
    decimals: 18,
  },
  infoURL: "official-vasyl.network",
  chainId: 1278060416,
  networkId: 1278060416,
  explorers: [
    {
      name: "Official Vasyl Explorer",
      url: "https://explorer.official-vasyl.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge.official-vasyl.network",
      },
    ],
  },
  status: "active",
} satisfies Chain
