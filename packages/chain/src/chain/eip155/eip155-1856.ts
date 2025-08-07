// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1856 = {
  name: "Teslafunds",
  shortName: "tsf",
  chain: "TSF",
  rpc: ["https://tsfapi.europool.me"],
  faucets: [],
  nativeCurrency: {
    name: "Teslafunds Ether",
    symbol: "TSF",
    decimals: 18,
  },
  infoURL: "https://teslafunds.io",
  chainId: 1856,
  networkId: 1,
} satisfies Chain
