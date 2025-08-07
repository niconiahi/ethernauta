// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_486 = {
  name: "Standard Mainnet",
  shortName: "stnd",
  chain: "STND",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Standard",
    symbol: "STND",
    decimals: 18,
  },
  infoURL: "https://standardweb3.com",
  chainId: 486,
  networkId: 486,
  status: "incubating",
} satisfies Chain
