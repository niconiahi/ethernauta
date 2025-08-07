// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_425 = {
  name: "Stenix Mainnet",
  shortName: "sten",
  chain: "STEN",
  icon: "stenix",
  rpc: ["https://stenix.network/pub"],
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
    name: "Stenix",
    symbol: "STEN",
    decimals: 18,
  },
  infoURL: "https://stenix.org",
  chainId: 425,
  networkId: 425,
  explorers: [
    {
      name: "stenscan",
      url: "https://stenscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
