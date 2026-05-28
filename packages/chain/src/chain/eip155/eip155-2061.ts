import type { Chain } from "../shared"

export const eip155_2061 = {
  name: "ZIGChain Testnet",
  shortName: "zigchain-testnet",
  chain: "ZIG",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "ZIG",
    symbol: "ZIG",
    decimals: 18,
  },
  infoURL: "https://zigchain.com/",
  chainId: 2061,
  networkId: 2061,
  status: "incubating",
} satisfies Chain
