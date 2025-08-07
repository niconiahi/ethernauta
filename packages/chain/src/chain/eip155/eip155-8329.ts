// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8329 = {
  name: "Lorenzo",
  shortName: "lrz",
  chain: "Lorenzo",
  icon: "lorenzo",
  rpc: ["https://rpc.lorenzo-protocol.xyz"],
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
    name: "Lorenzo stBTC",
    symbol: "stBTC",
    decimals: 18,
  },
  infoURL: "https://www.lorenzo-protocol.xyz/",
  chainId: 8329,
  networkId: 8329,
  explorers: [
    {
      name: "Lorenzo Explorer",
      url: "https://scan.lorenzo-protocol.xyz",
      standard: "none",
    },
  ],
} satisfies Chain
