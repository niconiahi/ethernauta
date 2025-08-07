/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11504 = {
  "name": "GEB Signet",
  "shortName": "geb-signet",
  "chain": "GEB",
  "icon": "geb",
  "rpc": [
    "https://signet.geb.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://geb.network",
  "chainId": 11504,
  "networkId": 11504,
  "explorers": [
    {
      "name": "geb signet scan",
      "url": "https://scan-signet.geb.network",
      "standard": "none"
    }
  ]
} satisfies Chain