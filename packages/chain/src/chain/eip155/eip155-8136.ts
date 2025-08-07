// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8136 = {
  name: "Mizana",
  shortName: "mizana",
  chain: "MEER",
  icon: "meer",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Mizana Mainnet",
    symbol: "MEER",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 8136,
  networkId: 8136,
  status: "incubating",
} satisfies Chain
