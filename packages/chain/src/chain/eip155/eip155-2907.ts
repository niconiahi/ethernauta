/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2907 = {
  "name": "Elux Chain",
  "shortName": "ELUX",
  "chain": "ELUX",
  "icon": "eluxchain",
  "rpc": [
    "https://rpc.eluxscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Elux Chain",
    "symbol": "ELUX",
    "decimals": 18
  },
  "infoURL": "https://eluxscan.com",
  "chainId": 2907,
  "networkId": 2907,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://eluxscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain