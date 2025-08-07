/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2345 = {
  "name": "GOAT Network",
  "shortName": "goat",
  "title": "GOAT Network",
  "chain": "GOAT",
  "icon": "goat",
  "rpc": [
    "https://rpc.goat.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://www.goat.network",
  "chainId": 2345,
  "networkId": 2345,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.goat.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain