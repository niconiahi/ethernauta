// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_205 = {
  name: "EKAASH",
  shortName: "ekaash",
  chain: "EKAASH",
  rpc: ["https://mainnet.ekaash.biz"],
  faucets: [],
  nativeCurrency: {
    name: "Global Mobile Money Gateway",
    symbol: "$EKH",
    decimals: 18,
  },
  infoURL: "https://ekaash.biz",
  chainId: 205,
  networkId: 205,
  slip44: 1,
  explorers: [],
} satisfies Chain
