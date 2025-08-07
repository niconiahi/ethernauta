// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_171 = {
  name: "CO2e Chain",
  shortName: "CO2e",
  chain: "CO2E",
  icon: "co2e",
  rpc: ["https://rpc.co2e.cc", "https://rpc.co2ledger.xyz"],
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
    name: "CO2e Token",
    symbol: "CO2E",
    decimals: 18,
  },
  infoURL: "https://co2e.cc",
  chainId: 171,
  networkId: 171,
  explorers: [
    {
      name: "CO2e Explorer",
      url: "https://exp.co2e.cc",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
