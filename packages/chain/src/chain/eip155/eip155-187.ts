/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_187 = {
  "name": "Dojima",
  "shortName": "dojima",
  "chain": "Dojima",
  "icon": "dojima",
  "rpc": [
    "https://rpc-d11k.dojima.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dojima",
    "symbol": "DOJ",
    "decimals": 18
  },
  "infoURL": "https://www.dojima.network/",
  "chainId": 187,
  "networkId": 187,
  "explorers": [
    {
      "name": "Dojima Explorer",
      "url": "https://explorer.dojima.network",
      "standard": "none"
    }
  ]
} satisfies Chain