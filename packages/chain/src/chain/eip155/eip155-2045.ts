// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2045 = {
  name: "AIW3 Mainnet",
  shortName: "AIW3",
  chain: "AIW3",
  icon: "aiw3",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://aiw3.io/",
  chainId: 2045,
  networkId: 2045,
  explorers: [],
  status: "incubating",
} satisfies Chain
