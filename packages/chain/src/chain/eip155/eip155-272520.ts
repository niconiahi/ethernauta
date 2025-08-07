// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_272520 = {
  name: "Nxy Oasis",
  shortName: "nxy",
  chain: "NXY",
  rpc: ["https://nxy.social/mainnet"],
  faucets: [],
  nativeCurrency: {
    name: "Nxy",
    symbol: "NXY",
    decimals: 18,
  },
  infoURL: "https://nxy.social/l1",
  chainId: 272520,
  networkId: 272520,
  slip44: 272520,
  explorers: [
    {
      name: "Nxy Explorer",
      url: "https://explorer.nxy.social",
      standard: "none",
    },
  ],
} satisfies Chain
