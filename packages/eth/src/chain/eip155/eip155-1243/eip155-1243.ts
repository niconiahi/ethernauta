/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1243 = {
  "name": "ARC Mainnet",
  "shortName": "ARC",
  "chain": "ARC",
  "icon": "arc",
  "rpc": [
    "https://rpc-main-1.archiechain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ARC",
    "symbol": "ARC",
    "decimals": 18
  },
  "infoURL": "https://archiechain.io/",
  "chainId": 1243,
  "networkId": 1243,
  "explorers": [
    {
      "name": "archiescan",
      "url": "https://app.archiescan.io",
      "standard": "none"
    }
  ]
} satisfies Chain