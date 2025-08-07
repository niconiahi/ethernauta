/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_40000 = {
  "name": "DIV Chain",
  "shortName": "divc",
  "chain": "DIVC",
  "icon": "divc",
  "rpc": [
    "https://rpc.divchain.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "DIVC",
    "symbol": "DIVC",
    "decimals": 18
  },
  "infoURL": "https://www.divchain.org",
  "chainId": 40000,
  "networkId": 40000,
  "explorers": [
    {
      "name": "DIV Chain explorer",
      "url": "https://scan.divchain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain