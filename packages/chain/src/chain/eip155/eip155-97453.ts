// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_97453 = {
  name: "Sidra Chain",
  shortName: "sidra",
  chain: "SIDRA",
  icon: "sidrachain",
  rpc: ["https://node.sidrachain.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Sidra Digital Asset",
    symbol: "SDA",
    decimals: 18,
  },
  infoURL: "https://www.sidrachain.com",
  chainId: 97453,
  networkId: 97453,
  explorers: [
    {
      name: "Sidra Chain Explorer",
      url: "https://ledger.sidrachain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
