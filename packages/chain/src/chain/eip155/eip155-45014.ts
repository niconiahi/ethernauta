// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_45014 = {
  name: "Juneo LINK1-Chain",
  shortName: "LINK1",
  chain: "Juneo LINK1-Chain",
  icon: "juneo-link1",
  rpc: [
    "https://rpc.juneo-mainnet.network/ext/bc/LINK1/rpc",
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
    name: "LINK1",
    symbol: "LINK1",
    decimals: 18,
  },
  infoURL: "https://juneo.com/",
  chainId: 45014,
  networkId: 45014,
  explorers: [
    {
      name: "Juneo Scan",
      url: "https://juneoscan.io/chain/13",
      standard: "none",
    },
  ],
} satisfies Chain
