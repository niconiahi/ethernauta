// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1853 = {
  name: "HighOctane Subnet",
  shortName: "HighOctane",
  chain: "HighOctane Subnet",
  icon: "highOctane",
  rpc: [
    "https://subnets.avax.network/highoctane/mainnet/rpc",
    "wss://subnets.avax.network/highoctane/mainnet/ws",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "HighOctane",
    symbol: "HO",
    decimals: 18,
  },
  infoURL:
    "https://subnets.avax.network/highoctane/details",
  chainId: 1853,
  networkId: 1853,
  explorers: [
    {
      name: "HighOctane Subnet Explorer",
      url: "https://subnets.avax.network/highoctane",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
