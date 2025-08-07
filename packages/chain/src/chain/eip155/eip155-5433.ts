// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5433 = {
  name: "Inertia Scan",
  shortName: "IRTA",
  chain: "IRTA",
  icon: "inertiascan",
  rpc: ["https://rpc.inertiascan.com"],
  faucets: [],
  nativeCurrency: {
    name: "Inertia",
    symbol: "IRTA",
    decimals: 18,
  },
  infoURL: "https://inertiascan.com",
  chainId: 5433,
  networkId: 5433,
  explorers: [
    {
      name: "blockscout",
      url: "https://inertiascan.com",
      standard: "none",
    },
  ],
} satisfies Chain
