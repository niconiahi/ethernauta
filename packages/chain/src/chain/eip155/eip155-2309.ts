// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2309 = {
  name: "Arevia",
  shortName: "arevia",
  chain: "Arevia",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Arev",
    symbol: "ARÉV",
    decimals: 18,
  },
  infoURL: "",
  chainId: 2309,
  networkId: 2309,
  explorers: [],
  status: "incubating",
} satisfies Chain
