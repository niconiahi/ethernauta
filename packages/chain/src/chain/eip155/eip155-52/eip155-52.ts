import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_52: Chain = {
  name: "CoinEx Smart Chain Mainnet",
  shortName: "cet",
  chain: "CSC",
  rpc: [
    "https://rpc.coinex.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CoinEx Chain Native Token",
    symbol: "cet",
    decimals: 18,
  },
  infoURL: "https://www.coinex.org/",
  chainId: 52,
  networkId: 52,
  explorers: [
    {
      name: "coinexscan",
      url: "https://www.coinex.net",
      standard: "none",
    },
  ],
}
