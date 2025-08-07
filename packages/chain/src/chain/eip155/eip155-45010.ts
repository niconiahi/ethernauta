// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_45010 = {
  name: "Juneo DOGE1-Chain",
  shortName: "DOGE1",
  chain: "Juneo DOGE1-Chain",
  icon: "juneo-doge1",
  rpc: [
    "https://rpc.juneo-mainnet.network/ext/bc/DOGE1/rpc",
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
    name: "DOGE1",
    symbol: "DOGE1",
    decimals: 18,
  },
  infoURL: "https://juneo.com/",
  chainId: 45010,
  networkId: 45010,
  explorers: [
    {
      name: "Juneo Scan",
      url: "https://juneoscan.io/chain/10",
      standard: "none",
    },
  ],
} satisfies Chain
