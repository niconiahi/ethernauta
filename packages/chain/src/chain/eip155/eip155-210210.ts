// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_210210 = {
  name: "Sorian Testnet",
  shortName: "sorianTestnet",
  chain: "tSOR",
  icon: "sorianTestnet",
  rpc: [
    "https://testnet-rpc.sorian.io",
    "https://testnet.rpc.sorian.io",
  ],
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
    name: "Sorian Testnet",
    symbol: "tSOR",
    decimals: 18,
  },
  infoURL: "https://mint.sorian.io",
  chainId: 210210,
  networkId: 210210,
  explorers: [],
} satisfies Chain
