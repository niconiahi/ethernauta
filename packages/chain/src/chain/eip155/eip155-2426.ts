// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2426 = {
  name: "Standard Testnet",
  shortName: "stndtestnet",
  chain: "STND Testnet",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Standard",
    symbol: "STND",
    decimals: 18,
  },
  infoURL: "https://standardweb3.com",
  chainId: 2426,
  networkId: 2426,
  status: "incubating",
} satisfies Chain
