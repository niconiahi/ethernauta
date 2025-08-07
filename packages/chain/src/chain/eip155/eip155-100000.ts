// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_100000 = {
  name: "QuarkChain Mainnet Root",
  shortName: "qkc-r",
  chain: "QuarkChain",
  rpc: ["http://jrpc.mainnet.quarkchain.io:38391"],
  faucets: [],
  nativeCurrency: {
    name: "QKC",
    symbol: "QKC",
    decimals: 18,
  },
  infoURL: "https://www.quarkchain.io",
  chainId: 100000,
  networkId: 100000,
} satisfies Chain
