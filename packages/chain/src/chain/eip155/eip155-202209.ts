// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_202209 = {
  name: "Alterscope",
  shortName: "Alterscope",
  chain: "Alterscope",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "RISK",
    symbol: "RISK",
    decimals: 18,
  },
  infoURL: "https://alterscope.org",
  chainId: 202209,
  networkId: 202209,
  status: "incubating",
} satisfies Chain
