// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_50312 = {
  name: "Somnia Testnet",
  shortName: "SomniaTestnet",
  chain: "Somnia",
  rpc: ["https://dream-rpc.somnia.network"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Somnia Testnet",
    symbol: "STT",
    decimals: 18,
  },
  infoURL: "https://somnia.network",
  chainId: 50312,
  networkId: 50312,
  explorers: [
    {
      name: "Somnia Testnet",
      url: "https://somnia-testnet.socialscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
