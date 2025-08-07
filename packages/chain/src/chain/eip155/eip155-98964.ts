// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_98964 = {
  name: "Pay1 Network",
  shortName: "pay1",
  chain: "PAY1",
  icon: "pay1",
  rpc: [
    "https://rpc.pay1coin.com",
    "https://rpc0.pay1coin.com",
    "https://rpc1.pay1coin.com",
    "https://rpc2.pay1coin.com",
    "wss://ws.pay1coin.com",
    "wss://ws0.pay1coin.com",
    "wss://ws1.pay1coin.com",
    "wss://ws2.pay1coin.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Pay1",
    symbol: "Pay1",
    decimals: 18,
  },
  infoURL: "https://pay1coin.com",
  chainId: 98964,
  networkId: 98964,
  explorers: [
    {
      name: "Pay1Scan",
      url: "https://pay1scan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
