// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6550 = {
  name: "Flamma Testnet",
  shortName: "FlammaTestnet",
  chain: "Flamma",
  rpc: ["https://testnetrpc.flamma.network"],
  faucets: [],
  nativeCurrency: {
    name: "Flamma",
    symbol: "FLA",
    decimals: 18,
  },
  infoURL: "https://flamma.network",
  chainId: 6550,
  networkId: 6550,
  explorers: [
    {
      name: "flascan",
      url: "https://testnet.flascan.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
