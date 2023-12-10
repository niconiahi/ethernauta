import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_123: Chain = {
  name: "Fuse Sparknet",
  shortName: "spark",
  chain: "fuse",
  rpc: [
    "https://rpc.fusespark.io",
  ],
  faucets: [
    "https://get.fusespark.io",
  ],
  nativeCurrency: {
    name: "Spark",
    symbol: "SPARK",
    decimals: 18,
  },
  infoURL: "https://docs.fuse.io/general/fuse-network-blockchain/fuse-testnet",
  chainId: 123,
  networkId: 123,
}
