import type { Chain } from "../shared"

export const eip155_1776 = {
  name: "Injective",
  shortName: "injective",
  chain: "Injective",
  icon: "injective",
  rpc: [
    "https://sentry.evm-rpc.injective.network",
    "wss://sentry.evm-ws.injective.network",
    "https://injectiveevm-rpc.polkachu.com",
    "wss://injectiveevm-ws.polkachu.com",
  ],
  faucets: ["https://injective.com/getinj"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Injective",
    symbol: "INJ",
    decimals: 18,
  },
  infoURL: "https://injective.com",
  chainId: 1776,
  networkId: 1776,
  slip44: 60,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.injective.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
