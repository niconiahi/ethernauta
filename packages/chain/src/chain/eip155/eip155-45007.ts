// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_45007 = {
  name: "Juneo mBTC1-Chain",
  shortName: "mBTC1",
  chain: "Juneo mBTC1-Chain",
  icon: "juneo-mbtc1",
  rpc: [
    "https://rpc.juneo-mainnet.network/ext/bc/mBTC1/rpc",
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
    name: "mBTC1",
    symbol: "mBTC1",
    decimals: 18,
  },
  infoURL: "https://juneo.com/",
  chainId: 45007,
  networkId: 45007,
  explorers: [
    {
      name: "Juneo Scan",
      url: "https://juneoscan.io/chain/9",
      standard: "none",
    },
  ],
} satisfies Chain
