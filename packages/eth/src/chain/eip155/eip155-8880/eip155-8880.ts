/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8880 = {
  "name": "Unique",
  "shortName": "unq",
  "chain": "UNQ",
  "icon": "unique",
  "rpc": [
    "https://rpc.unique.network",
    "https://eu-rpc.unique.network",
    "https://asia-rpc.unique.network",
    "https://us-rpc.unique.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Unique",
    "symbol": "UNQ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "chainId": 8880,
  "networkId": 8880,
  "explorers": [
    {
      "name": "Unique Scan",
      "url": "https://uniquescan.io/unique",
      "standard": "none"
    }
  ]
} satisfies Chain