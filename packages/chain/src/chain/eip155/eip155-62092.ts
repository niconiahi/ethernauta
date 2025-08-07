// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_62092 = {
  name: "TikTrix Testnet",
  shortName: "tiktrix-testnet",
  chain: "tTTX",
  icon: "tiktrix",
  rpc: ["https://tiktrix-rpc.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "tTTX",
    symbol: "tTTX",
    decimals: 18,
  },
  infoURL: "https://tiktrix.gg",
  chainId: 62092,
  networkId: 62092,
  slip44: 1,
  explorers: [
    {
      name: "TikTrix Testnet Explorer",
      url: "https://tiktrix.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
