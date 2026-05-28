import type { Chain } from "../shared"

export const eip155_11111111 = {
  name: "ClawCoin",
  shortName: "cc",
  chain: "CC",
  icon: "clawcoin",
  rpc: ["https://evm.clawcoin.com"],
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
  chainId: 11111111,
  networkId: 11111111,
  slip44: 60,
  status: "active",
} satisfies Chain
