// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_710420 = {
  name: "Tiltyard Mainnet Subnet",
  shortName: "tiltyardmainnet",
  chain: "TILTYARD",
  rpc: [
    "https://subnets.avax.network/tiltyard/mainnet/rpc",
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
    name: "TILT",
    symbol: "TILT",
    decimals: 18,
  },
  infoURL: "https://play.tiltyard.gg/",
  chainId: 710420,
  networkId: 710420,
  explorers: [
    {
      name: "TILTYARD Explorer",
      url: "https://subnets.avax.network/tiltyard",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
