/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7923 = {
  "name": "Dot Blox",
  "shortName": "DTBX",
  "chain": "DTBX",
  "icon": "dotblox",
  "rpc": [
    "https://rpc.dotblox.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dot Blox",
    "symbol": "DTBX",
    "decimals": 18
  },
  "infoURL": "https://explorer.dotblox.io",
  "chainId": 7923,
  "networkId": 7923,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.dotblox.io",
      "standard": "none"
    }
  ]
} satisfies Chain