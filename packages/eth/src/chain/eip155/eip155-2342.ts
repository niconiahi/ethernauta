/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2342 = {
  "name": "Omnia Chain",
  "shortName": "omnia",
  "chain": "OMNIA",
  "icon": "omnia",
  "rpc": [
    "https://rpc.omniaverse.io"
  ],
  "faucets": [
    "https://www.omniaverse.io"
  ],
  "nativeCurrency": {
    "name": "Omnia",
    "symbol": "OMNIA",
    "decimals": 18
  },
  "infoURL": "https://www.omniaverse.io",
  "chainId": 2342,
  "networkId": 2342,
  "explorers": [
    {
      "name": "OmniaVerse Explorer",
      "url": "https://scan.omniaverse.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain