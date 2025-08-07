// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_383414847825 = {
  name: "Zeniq",
  shortName: "zeniq",
  chain: "ZENIQ",
  icon: "zeniq",
  rpc: ["https://api.zeniq.network"],
  faucets: [
    "https://faucet.nomo.zone/",
    "https://faucet.zeniq.net/",
  ],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Zeniq",
    symbol: "ZENIQ",
    decimals: 18,
  },
  infoURL: "https://www.zeniq.dev/",
  chainId: 383414847825,
  networkId: 383414847825,
  ens: {
    registry: "0xa0446c88240bCA2A8E0f68C93aa365d25B198aA4",
  },
  explorers: [
    {
      name: "zeniqscan",
      url: "https://zeniqscan.com",
      standard: "EIP3091",
    },
    {
      name: "zeniq-smart-chain-explorer",
      url: "https://smart.zeniq.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
