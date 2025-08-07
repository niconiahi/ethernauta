// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4999 = {
  name: "BlackFort Exchange Network Deprecated",
  shortName: "BXNdpr",
  chain: "BXNdpr",
  icon: "bxn",
  rpc: [
    "https://mainnet.blackfort.network/rpc",
    "https://mainnet-1.blackfort.network/rpc",
    "https://mainnet-2.blackfort.network/rpc",
    "https://mainnet-3.blackfort.network/rpc",
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
    name: "BlackFort Token",
    symbol: "BXNdpr",
    decimals: 18,
  },
  infoURL: "https://blackfort.exchange",
  chainId: 4999,
  networkId: 4999,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.blackfort.network",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} satisfies Chain
