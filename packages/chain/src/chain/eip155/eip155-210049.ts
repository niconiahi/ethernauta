// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_210049 = {
  name: "GitAGI Atlas Testnet",
  shortName: "atlas",
  chain: "GitAGI",
  rpc: ["https://rpc.gitagi.org"],
  faucets: [],
  nativeCurrency: {
    name: "GitAGI",
    symbol: "tGAGI",
    decimals: 18,
  },
  infoURL: "https://gitagi.org/",
  chainId: 210049,
  networkId: 210049,
} satisfies Chain
