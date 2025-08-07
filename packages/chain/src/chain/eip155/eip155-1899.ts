// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1899 = {
  name: "ReDeFi Layer 2",
  shortName: "red",
  chain: "ReDeFi",
  icon: "redefi",
  rpc: ["https://layer2.redefi.world"],
  faucets: [],
  nativeCurrency: {
    name: "RED",
    symbol: "RED",
    decimals: 18,
  },
  infoURL: "https://redefi.world",
  chainId: 1899,
  networkId: 1899,
  slip44: 1899,
  explorers: [
    {
      name: "ReDeFi Scan",
      url: "https://scanlayer2.redefi.world",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
