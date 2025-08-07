// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5545 = {
  name: "DuckChain Mainnet",
  shortName: "Duck-Chain-Mainnet",
  title: "DuckChain Mainnet",
  chain: "DuckChain",
  icon: "duckchain",
  rpc: [
    "https://rpc.duckchain.io",
    "https://rpc-hk.duckchain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TON",
    symbol: "TON",
    decimals: 18,
  },
  infoURL: "https://duckchain.io",
  chainId: 5545,
  networkId: 5545,
} satisfies Chain
