// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_104566 = {
  name: "KaspaClassic Mainnet",
  shortName: "cas",
  chain: "KaspaClassic",
  icon: "kaspaclassic",
  rpc: [
    "https://api.kaspaclassic.world/",
    "http://80.178.101.118:8000/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "KaspaClassic",
    symbol: "CAS",
    decimals: 18,
  },
  infoURL: "https://kaspaclassic.com/",
  chainId: 104566,
  networkId: 104566,
  explorers: [
    {
      name: "KaspaClassic Explorer",
      url: "https://explorer.kaspaclassic.world",
      standard: "none",
    },
  ],
} satisfies Chain
