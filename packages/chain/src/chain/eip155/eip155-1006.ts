// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1006 = {
  name: "LemonChain",
  shortName: "lemx",
  chain: "LEMX",
  rpc: [
    "https://rpc.lemonchain.io",
    "https://rpc.allthingslemon.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "LEMX",
    symbol: "LEMX",
    decimals: 18,
  },
  infoURL: "https://dapp.allthingslemon.io/home",
  chainId: 1006,
  networkId: 1006,
  explorers: [],
} satisfies Chain
