/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_53 = {
  "name": "CoinEx Smart Chain Testnet",
  "shortName": "tcet",
  "chain": "CSC",
  "rpc": [
    "https://testnet-rpc.coinex.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CoinEx Chain Test Native Token",
    "symbol": "cett",
    "decimals": 18
  },
  "infoURL": "https://www.coinex.org/",
  "chainId": 53,
  "networkId": 53,
  "slip44": 1,
  "explorers": [
    {
      "name": "coinexscan",
      "url": "https://testnet.coinex.net",
      "standard": "none"
    }
  ]
} satisfies Chain