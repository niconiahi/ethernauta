// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_325: Chain = {
  name: "GRVT Exchange",
  shortName: "grvt",
  chain: "ETH",
  icon: "grvt",
  rpc: ["https://rpc.grvt.io"],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://grvt.io/",
  chainId: 325,
  networkId: 325,
  explorers: [],
}
