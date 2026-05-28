import type { Chain } from "../shared"

export const eip155_11111110 = {
  name: "ClawCoin Testnet",
  shortName: "cc-testnet",
  chain: "CC",
  icon: "clawcoin",
  rpc: ["https://evm-testnet.clawcoin.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "ClawCoin",
    symbol: "CC",
    decimals: 18,
  },
  infoURL: "https://clawcoin.com",
  chainId: 11111110,
  networkId: 11111110,
  slip44: 60,
  status: "active",
} satisfies Chain
