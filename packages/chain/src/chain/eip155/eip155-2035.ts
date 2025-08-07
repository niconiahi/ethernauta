// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2035 = {
  name: "Phala Network",
  shortName: "phala",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://phala.network",
  chainId: 2035,
  networkId: 2035,
  status: "incubating",
} satisfies Chain
