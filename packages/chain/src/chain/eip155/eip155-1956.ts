// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1956 = {
  name: "AIW3 Testnet",
  shortName: "AIW3-Testnet",
  chain: "AIW3",
  icon: "aiw3",
  rpc: ["https://rpc-testnet.aiw3.io/"],
  faucets: [],
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://aiw3.io/",
  chainId: 1956,
  networkId: 1956,
  explorers: [
    {
      name: "aiw3 testnet scan",
      url: "https://scan-testnet.aiw3.io",
      standard: "none",
    },
  ],
} satisfies Chain
