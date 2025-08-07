// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_210209 = {
  name: "Sorian",
  shortName: "sorian",
  chain: "SOR",
  rpc: ["https://rpc.sorian.io"],
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
    name: "Sorian",
    symbol: "SOR",
    decimals: 18,
  },
  infoURL: "https://sorian.io",
  chainId: 210209,
  networkId: 210209,
  explorers: [],
} satisfies Chain
