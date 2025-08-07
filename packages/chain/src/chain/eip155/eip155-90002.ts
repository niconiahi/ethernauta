// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_90002 = {
  name: "UBIT SMARTCHAIN MAINNET",
  shortName: "UBITSCAN",
  chain: "UBIT SMARTCHAIN",
  rpc: ["https://rpc.ubitscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "USC",
    symbol: "USC",
    decimals: 18,
  },
  infoURL: "https://ubitscan.io",
  chainId: 90002,
  networkId: 90002,
  slip44: 108,
  explorers: [
    {
      name: "UBITSCAN",
      url: "https://ubitscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
