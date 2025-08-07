// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_45004 = {
  name: "Juneo DAI1-Chain",
  shortName: "DAI1",
  chain: "Juneo DAI1-Chain",
  icon: "juneo-dai1",
  rpc: [
    "https://rpc.juneo-mainnet.network/ext/bc/DAI1/rpc",
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
    name: "DAI1",
    symbol: "DAI1",
    decimals: 18,
  },
  infoURL: "https://juneo.com/",
  chainId: 45004,
  networkId: 45004,
  explorers: [
    {
      name: "Juneo Scan",
      url: "https://juneoscan.io/chain/5",
      standard: "none",
    },
  ],
} satisfies Chain
