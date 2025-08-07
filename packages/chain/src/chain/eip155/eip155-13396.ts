// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_13396 = {
  name: "Masa",
  shortName: "masa",
  chain: "MASA",
  icon: "masa",
  rpc: [
    "https://subnets.avax.network/masanetwork/mainnet/rpc",
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
  chainId: 13396,
  networkId: 13396,
  explorers: [
    {
      name: "Masa Explorer",
      url: "https://subnets.avax.network/masa",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
