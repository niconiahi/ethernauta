// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_158345 = {
  name: "XCOIN",
  shortName: "xcoin",
  chain: "XCOIN",
  rpc: ["https://rpc-xcoin.cryptoxnetwork.io"],
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
    name: "XCOIN",
    symbol: "XCOIN",
    decimals: 18,
  },
  infoURL: "https://cryptoxnetwork.io",
  chainId: 158345,
  networkId: 158345,
  explorers: [
    {
      name: "CryptoX explorer",
      url: "https://cryptoxscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
