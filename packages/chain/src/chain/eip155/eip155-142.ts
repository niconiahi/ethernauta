// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_142 = {
  name: "DAX CHAIN",
  shortName: "dax",
  chain: "DAX",
  rpc: ["https://rpc.prodax.io"],
  faucets: [],
  nativeCurrency: {
    name: "Prodax",
    symbol: "DAX",
    decimals: 18,
  },
  infoURL: "https://prodax.io/",
  chainId: 142,
  networkId: 142,
} satisfies Chain
