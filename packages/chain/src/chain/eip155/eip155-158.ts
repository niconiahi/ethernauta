// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_158 = {
  name: "Roburna Mainnet",
  shortName: "rba",
  chain: "RBA",
  icon: "roburna",
  rpc: ["https://dataseed.roburna.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Roburna",
    symbol: "RBA",
    decimals: 18,
  },
  infoURL: "https://www.roburna.com/",
  chainId: 158,
  networkId: 158,
  explorers: [
    {
      name: "Rbascan Explorer",
      url: "https://rbascan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
