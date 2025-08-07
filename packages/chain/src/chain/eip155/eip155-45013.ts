// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_45013 = {
  name: "Juneo BCH1-Chain",
  shortName: "BCH1",
  chain: "Juneo BCH1-Chain",
  icon: "juneo-bch1",
  rpc: [
    "https://rpc.juneo-mainnet.network/ext/bc/BCH1/rpc",
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
    name: "BCH1",
    symbol: "BCH1",
    decimals: 18,
  },
  infoURL: "https://juneo.com/",
  chainId: 45013,
  networkId: 45013,
  explorers: [
    {
      name: "Juneo Scan",
      url: "https://juneoscan.io/chain/12",
      standard: "none",
    },
  ],
} satisfies Chain
