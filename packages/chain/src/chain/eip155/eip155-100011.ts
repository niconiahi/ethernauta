// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_100011 = {
  name: "QuarkChain L2 Mainnet",
  shortName: "qkc-l2",
  chain: "QuarkChain",
  rpc: ["https://mainnet-l2-ethapi.quarkchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "QKC",
    symbol: "QKC",
    decimals: 18,
  },
  infoURL: "https://www.quarkchain.io",
  chainId: 100011,
  networkId: 100011,
  parent: {
    type: "L2",
    chain: "eip155-100000",
  },
} satisfies Chain
