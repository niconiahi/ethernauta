import type { Chain } from "../shared"

export const eip155_1236 = {
  name: "BrainArk",
  shortName: "bak",
  chain: "BAK",
  icon: "brainark",
  rpc: ["https://rpc.brainark.online"],
  faucets: [],
  nativeCurrency: {
    name: "BrainArk",
    symbol: "BAK",
    decimals: 18,
  },
  infoURL: "https://brainark.online",
  chainId: 1236,
  networkId: 1236,
  explorers: [],
} satisfies Chain
