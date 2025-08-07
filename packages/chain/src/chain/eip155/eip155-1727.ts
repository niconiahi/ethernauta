// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1727 = {
  name: "Ethpar Mainnet",
  shortName: "ethpar",
  chain: "ETP",
  icon: "ethpar",
  rpc: ["https://rpc01.ethpar.net/"],
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
    name: "Ethpar",
    symbol: "ETP",
    decimals: 18,
  },
  infoURL: "https://ethpar.com",
  chainId: 1727,
  networkId: 1727,
  explorers: [
    {
      name: "Ethpar Mainnet Explorer",
      url: "https://dora.ethpar.net",
      standard: "none",
    },
  ],
} satisfies Chain
