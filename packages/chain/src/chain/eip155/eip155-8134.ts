// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8134 = {
  name: "Amana",
  shortName: "amana",
  chain: "MEER",
  icon: "meer",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Amana Mainnet",
    symbol: "MEER",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 8134,
  networkId: 8134,
  status: "incubating",
} satisfies Chain
