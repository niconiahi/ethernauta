/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1994 = {
  "name": "Ekta",
  "shortName": "ekta",
  "chain": "EKTA",
  "icon": "ekta",
  "rpc": [
    "https://main.ekta.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EKTA",
    "symbol": "EKTA",
    "decimals": 18
  },
  "infoURL": "https://www.ekta.io",
  "chainId": 1994,
  "networkId": 1994,
  "explorers": [
    {
      "name": "ektascan",
      "url": "https://ektascan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain