// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2024 = {
  name: "Swan Saturn Testnet",
  shortName: "saturn",
  chain: "SWAN",
  rpc: ["https://saturn-rpc.swanchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "SWANETH",
    symbol: "sETH",
    decimals: 18,
  },
  infoURL: "https://swanchain.io/",
  chainId: 2024,
  networkId: 2024,
} satisfies Chain
