// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_103454 = {
  name: "Masa Testnet",
  shortName: "masatest",
  chain: "MASA",
  icon: "masa",
  rpc: [
    "https://subnets.avax.network/masatestne/testnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Masa Token",
    symbol: "MASA",
    decimals: 18,
  },
  infoURL: "https://masa.finance",
  chainId: 103454,
  networkId: 103454,
  explorers: [
    {
      name: "Masa Testnet Explorer",
      url: "https://subnets-test.avax.network/masatestnet",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
