// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_258432 = {
  name: "Althea L1 Mainnet",
  shortName: "ALTHEA",
  chain: "ALTHEA",
  icon: "althea",
  rpc: ["https://rpc.althea.zone"],
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
    name: "Althea",
    symbol: "ALTHEA",
    decimals: 18,
  },
  infoURL: "https://althea.net",
  chainId: 258432,
  networkId: 258432,
  slip44: 60,
  explorers: [
    {
      name: "Mintscan",
      url: "https://mintscan.io/althea",
      standard: "none",
    },
  ],
} satisfies Chain
