// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8087 = {
  name: "E-Dollar",
  shortName: "E-Dollar",
  chain: "USD",
  icon: "edollar",
  rpc: ["https://rpc.e-dollar.org"],
  faucets: [],
  nativeCurrency: {
    name: "E-Dollar",
    symbol: "USD",
    decimals: 18,
  },
  infoURL: "https://e-dollar.org",
  chainId: 8087,
  networkId: 8087,
  explorers: [],
} satisfies Chain
