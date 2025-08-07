// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1212101 = {
  name: "1Money Network Testnet",
  shortName: "1money-testnet",
  chain: "1Money Testnet",
  rpc: ["https://testnet.1money.network"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "USD1",
    symbol: "USD1",
    decimals: 18,
  },
  infoURL: "https://1money.com",
  chainId: 1212101,
  networkId: 1212101,
  explorers: [],
} satisfies Chain
