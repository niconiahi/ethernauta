// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10058111 = {
  name: "Spotlight",
  shortName: "spotlight",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://spotlightchain.com/",
  chainId: 10058111,
  networkId: 10058111,
  status: "incubating",
} satisfies Chain
