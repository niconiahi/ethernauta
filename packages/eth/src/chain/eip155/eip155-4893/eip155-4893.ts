/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4893 = {
  "name": "Globel Chain",
  "shortName": "GC",
  "chain": "GC",
  "icon": "globelchain",
  "rpc": [
    "https://rpc.gcscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Globel Chain",
    "symbol": "GC",
    "decimals": 18
  },
  "infoURL": "https://gcscan.io",
  "chainId": 4893,
  "networkId": 4893,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gcscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain