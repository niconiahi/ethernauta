// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6699 = {
  name: "OX Chain",
  shortName: "ox-chain",
  title: "OX Chain",
  chain: "OX",
  rpc: ["https://rpc.oxscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "OX",
    symbol: "OX",
    decimals: 18,
  },
  infoURL: "https://ox.fun/chain",
  chainId: 6699,
  networkId: 6699,
  status: "incubating",
} satisfies Chain
