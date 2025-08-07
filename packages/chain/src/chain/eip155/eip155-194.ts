// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_194 = {
  name: "firachain",
  shortName: "FIR",
  chain: "FIR",
  icon: "firachainIcon",
  rpc: ["https://rpc.firachain.com"],
  faucets: [],
  nativeCurrency: {
    name: "firachain",
    symbol: "FIR",
    decimals: 18,
  },
  infoURL: "https://firachain.com",
  chainId: 194,
  networkId: 194,
  explorers: [
    {
      name: "FiraChain Explorer",
      url: "https://block.firachain.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
