// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_47803 = {
  name: "ReDeFi Layer 1",
  shortName: "bax",
  chain: "ReDeFi",
  icon: "redefi",
  rpc: ["https://layer1.redefi.world"],
  faucets: [],
  nativeCurrency: {
    name: "BAX",
    symbol: "BAX",
    decimals: 18,
  },
  infoURL: "https://redefi.world",
  chainId: 47803,
  networkId: 47803,
  slip44: 47803,
  explorers: [
    {
      name: "ReDeFi Scan",
      url: "https://scanlayer1.redefi.world",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
