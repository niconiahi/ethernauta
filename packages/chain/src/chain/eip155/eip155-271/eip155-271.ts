import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_271: Chain = {
  name: "EgonCoin Mainnet",
  shortName: "EGONm",
  chain: "EGON",
  icon: "egonicon",
  rpc: [
    "https://rpc.egonscan.com",
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
  chainId: 271,
  networkId: 271,
  explorers: [
    {
      name: "EgonCoin Mainnet",
      url: "https://egonscan.com",
      standard: "EIP3091",
    },
  ],
}
