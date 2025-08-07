// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_333313 = {
  name: "Bloom Genesis Mainnet",
  shortName: "BGBC",
  chain: "Bloom",
  icon: "bloom",
  rpc: ["https://mainnet-rpc.bloomgenesis.com"],
  faucets: [],
  nativeCurrency: {
    name: "Bloom",
    symbol: "BGBC",
    decimals: 18,
  },
  infoURL: "https://www.bloomgenesis.com",
  chainId: 333313,
  networkId: 333313,
  explorers: [
    {
      name: "Bloom Genesis Mainnet",
      url: "https://explorer.bloomgenesis.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
