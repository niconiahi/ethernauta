/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_18181 = {
  name: "G8Chain Testnet",
  shortName: "G8Ct",
  chain: "G8C",
  icon: "G8Chain",
  rpc: [
    "https://testnet-rpc.oneg8.network",
  ],
  faucets: [
    "https://faucet.oneg8.network",
  ],
  nativeCurrency: {
    name: "G8Coin",
    symbol: "G8C",
    decimals: 18,
  },
  infoURL: "https://oneg8.one",
  chainId: 18181,
  networkId: 18181,
  explorers: [
    {
      name: "G8Chain",
      url: "https://testnet.oneg8.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
