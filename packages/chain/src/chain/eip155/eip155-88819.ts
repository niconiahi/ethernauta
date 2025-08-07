// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_88819 = {
  name: "Unit Zero Stagenet",
  shortName: "unit0-stagenet",
  chain: "Unit Zero",
  icon: "unitzero",
  rpc: ["https://rpc-stagenet.unit0.dev"],
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
    name: "UNIT0",
    symbol: "UNIT0",
    decimals: 18,
  },
  infoURL: "https://units.network",
  chainId: 88819,
  networkId: 88819,
  explorers: [
    {
      name: "explorer-stagenet",
      url: "https://explorer-stagenet.unit0.dev",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
