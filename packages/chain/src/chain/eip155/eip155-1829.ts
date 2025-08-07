// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1829 = {
  name: "PlayBlock",
  shortName: "playblock",
  chain: "playblock",
  rpc: [
    "https://rpc.playblock.io",
    "wss://ws.playblock.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "PlayBlock",
    symbol: "PBG",
    decimals: 18,
  },
  infoURL: "https://www.playnance.com",
  chainId: 1829,
  networkId: 1829,
  slip44: 60,
  explorers: [
    {
      name: "PlayBlock",
      url: "https://explorer.playblock.io",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-42161",
    bridges: [
      {
        url: "https://bridge.gelato.network/bridge/playblock",
      },
    ],
  },
} satisfies Chain
