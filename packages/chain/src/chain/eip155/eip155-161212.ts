// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_161212 = {
  name: "PlayFi Mainnet",
  shortName: "playfi",
  chain: "PLAY",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Play",
    symbol: "PLAY",
    decimals: 18,
  },
  infoURL: "https://www.playfi.ai/",
  chainId: 161212,
  networkId: 161212,
  explorers: [],
  status: "incubating",
} satisfies Chain
