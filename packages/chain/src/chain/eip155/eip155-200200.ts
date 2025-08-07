// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_200200 = {
  name: "Zoo Mainnet",
  shortName: "zoo",
  chain: "Zoo",
  icon: "zoo",
  rpc: ["https://api.zoo.network"],
  faucets: ["https://faucet.zoo-test.network"],
  nativeCurrency: {
    name: "Zoo",
    symbol: "ZOO",
    decimals: 18,
  },
  infoURL: "https://zoo.network",
  chainId: 200200,
  networkId: 200200,
  explorers: [
    {
      name: "Zoo Network Explorer",
      url: "https://explore.zoo.network",
      standard: "EIP3091",
    },
    {
      name: "Zoo Network Explorer",
      url: "https://explore.zoo-test.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
