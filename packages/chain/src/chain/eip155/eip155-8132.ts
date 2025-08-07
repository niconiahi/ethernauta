// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8132 = {
  name: "Qitmeer Network Mixnet",
  shortName: "meermix",
  chain: "MEER",
  icon: "meer",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Qitmeer Mixnet",
    symbol: "MEER-M",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 8132,
  networkId: 8132,
  status: "incubating",
} satisfies Chain
