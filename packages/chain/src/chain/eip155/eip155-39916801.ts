// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_39916801 = {
  name: "Kingdom Chain",
  shortName: "kchain",
  chain: "KingdomChain",
  rpc: ["https://kingdomchain.observer/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Kozi",
    symbol: "KOZI",
    decimals: 18,
  },
  infoURL: "https://www.beastkingdom.io/",
  chainId: 39916801,
  networkId: 39916801,
  explorers: [
    {
      name: "TravelSong",
      url: "https://www.beastkingdom.io/travelsong",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
