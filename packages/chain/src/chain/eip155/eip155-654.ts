// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_654 = {
  name: "Kalichain",
  shortName: "kalichainMainnet",
  chain: "Kalichain",
  icon: "kalichain",
  rpc: ["https://mainnet.kalichain.com"],
  faucets: [],
  nativeCurrency: {
    name: "kalis",
    symbol: "KALIS",
    decimals: 18,
  },
  infoURL: "https://kalichain.com",
  chainId: 654,
  networkId: 654,
  explorers: [
    {
      name: "kalichain explorer",
      url: "https://explorer.kalichain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
