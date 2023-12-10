import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_271271: Chain = {
  name: "EgonCoin Testnet",
  shortName: "EGONt",
  chain: "EGON",
  icon: "egonicon",
  rpc: [
    "https://rpctest.egonscan.com",
  ],
  faucets: [
    "https://faucet.egonscan.com",
  ],
  nativeCurrency: {
    name: "EgonCoin",
    symbol: "EGON",
    decimals: 18,
  },
  infoURL: "https://egonscan.com",
  chainId: 271271,
  networkId: 271271,
  explorers: [
    {
      name: "EgonCoin Testnet",
      url: "https://testnet.egonscan.com",
      standard: "EIP3091",
    },
  ],
}
