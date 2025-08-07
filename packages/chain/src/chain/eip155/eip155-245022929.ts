// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_245022929 = {
  name: "Neon EVM Devnet Rollup",
  shortName: "neonevm-devnet-rollup",
  chain: "Solana",
  icon: "neon",
  rpc: ["https://devnet.rollup.neonevm.org/"],
  faucets: [],
  nativeCurrency: {
    name: "Neon",
    symbol: "NEON",
    decimals: 18,
  },
  infoURL: "https://neonevm.org/",
  chainId: 245022929,
  networkId: 245022929,
  explorers: [],
} satisfies Chain
