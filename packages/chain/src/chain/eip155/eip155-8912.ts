// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8912 = {
  name: "Algen Testnet",
  shortName: "algTest",
  chain: "ALG",
  icon: "alg",
  rpc: ["https://rpc.test.algen.network"],
  faucets: [],
  nativeCurrency: {
    name: "ALG",
    symbol: "ALG",
    decimals: 18,
  },
  infoURL: "https://www.algen.network",
  chainId: 8912,
  networkId: 8912,
  explorers: [
    {
      name: "algscan",
      url: "https://scan.test.algen.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
