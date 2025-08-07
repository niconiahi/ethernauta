// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_102031 = {
  name: "Creditcoin Testnet",
  shortName: "ctctest",
  chain: "CTC",
  icon: "creditcoin",
  rpc: ["https://rpc.cc3-testnet.creditcoin.network"],
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
    name: "Testnet CTC",
    symbol: "tCTC",
    decimals: 18,
  },
  infoURL: "https://creditcoin.org",
  chainId: 102031,
  networkId: 102031,
  explorers: [
    {
      name: "blockscout",
      url: "https://creditcoin-testnet.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
