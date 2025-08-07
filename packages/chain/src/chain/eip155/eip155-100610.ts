// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_100610 = {
  name: "Monsoon ",
  shortName: "monsoon",
  chain: "MONSOON",
  icon: "monsoon",
  rpc: ["https://monsoon.rainfall.one"],
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
    name: "RDP",
    symbol: "RDP",
    decimals: 18,
  },
  infoURL: "",
  chainId: 100610,
  networkId: 100610,
  explorers: [
    {
      name: "Monsoon Scan",
      url: "https://scout.monsoon.rainfall.one",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
