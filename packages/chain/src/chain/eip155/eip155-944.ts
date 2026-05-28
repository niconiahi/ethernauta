import type { Chain } from "../shared"

export const eip155_944 = {
  name: "ZIGChain",
  shortName: "zigchain",
  chain: "ZIG",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "ZIG",
    symbol: "ZIG",
    decimals: 18,
  },
  infoURL: "https://zigchain.com/",
  chainId: 944,
  networkId: 944,
  status: "incubating",
} satisfies Chain
