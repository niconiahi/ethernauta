// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_45012 = {
  name: "Juneo SGD1-Chain",
  shortName: "SGD1",
  chain: "Juneo SGD1-Chain",
  icon: "juneo-sgd1",
  rpc: [
    "https://rpc.juneo-mainnet.network/ext/bc/SGD1/rpc",
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
    name: "SGD1",
    symbol: "SGD1",
    decimals: 18,
  },
  infoURL: "https://juneo.com/",
  chainId: 45012,
  networkId: 45012,
  explorers: [
    {
      name: "Juneo Scan",
      url: "https://juneoscan.io/chain/7",
      standard: "none",
    },
  ],
} satisfies Chain
