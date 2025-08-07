// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8921 = {
  name: "Algen Layer2",
  shortName: "algl2",
  chain: "ALG L2",
  icon: "algl2",
  rpc: ["https://rpc.alg2.algen.network"],
  faucets: [],
  nativeCurrency: {
    name: "ALG",
    symbol: "ALG",
    decimals: 18,
  },
  infoURL: "https://www.algen.network",
  chainId: 8921,
  networkId: 8921,
  explorers: [
    {
      name: "algl2scan",
      url: "https://scan.alg2.algen.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "shard",
    chain: "eip155-8911",
  },
} satisfies Chain
