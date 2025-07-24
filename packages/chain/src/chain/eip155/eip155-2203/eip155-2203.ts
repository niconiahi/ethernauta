/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2203 = {
  "name": "Bitcoin EVM",
  "shortName": "BTC",
  "chain": "Bitcoin EVM",
  "icon": "ebtc",
  "rpc": [
    "https://connect.bitcoinevm.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://bitcoinevm.com",
  "chainId": 2203,
  "networkId": 2203,
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer.bitcoinevm.com",
      "standard": "none"
    }
  ]
} satisfies Chain