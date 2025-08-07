// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_45008 = {
  name: "Juneo GLD1-Chain",
  shortName: "GLD1",
  chain: "Juneo GLD1-Chain",
  icon: "juneo-gld1",
  rpc: [
    "https://rpc.juneo-mainnet.network/ext/bc/GLD1/rpc",
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
    name: "GLD1",
    symbol: "GLD1",
    decimals: 18,
  },
  infoURL: "https://juneo.com/",
  chainId: 45008,
  networkId: 45008,
  explorers: [
    {
      name: "Juneo Scan",
      url: "https://juneoscan.io/chain/8",
      standard: "none",
    },
  ],
} satisfies Chain
