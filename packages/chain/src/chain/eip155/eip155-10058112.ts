// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10058112 = {
  name: "Spotlight Sepolia Testnet",
  shortName: "spotlightsep",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://spotlightchain.com/",
  chainId: 10058112,
  networkId: 10058112,
  status: "incubating",
} satisfies Chain
