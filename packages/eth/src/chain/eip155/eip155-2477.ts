/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2477 = {
  "name": "6Degree of Outreach",
  "shortName": "6do",
  "chain": "6DO",
  "icon": "6do",
  "rpc": [
    "https://rpc.6dochain.com",
    "https://rpc2.6dochain.com",
    "https://rpc3.6dochain.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "6Degree Coin",
    "symbol": "6DO",
    "decimals": 18
  },
  "infoURL": "https://6do.world",
  "chainId": 2477,
  "networkId": 2477,
  "explorers": [
    {
      "name": "6Degree Chain Explorer",
      "url": "https://explorer.6dochain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain