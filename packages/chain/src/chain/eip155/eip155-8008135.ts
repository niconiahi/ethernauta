// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8008135 = {
  name: "Fhenix Helium",
  shortName: "fhe-helium",
  chain: "tFHE",
  rpc: ["https://api.helium.fhenix.zone"],
  faucets: ["https://get-helium.fhenix.zone"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "tFHE",
    symbol: "tFHE",
    decimals: 18,
  },
  infoURL: "https://www.fhenix.io",
  chainId: 8008135,
  networkId: 8008135,
  explorers: [
    {
      name: "Fhenix Helium Explorer (Blockscout)",
      url: "https://explorer.helium.fhenix.zone",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
