// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_81353 = {
  name: "Flana Privnet",
  shortName: "flanapriv",
  chain: "MEER",
  icon: "meer",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Flana Privnet",
    symbol: "MEER-P",
    decimals: 18,
  },
  infoURL: "https://github.com/Qitmeer",
  chainId: 81353,
  networkId: 81353,
  status: "incubating",
} satisfies Chain
