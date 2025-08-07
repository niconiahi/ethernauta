/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_80096 = {
  "name": "Hizoco mainnet",
  "shortName": "hzc",
  "chain": "HZC",
  "icon": "hizoco",
  "rpc": [
    "https://hizoco.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Hizoco",
    "symbol": "HZC",
    "decimals": 18
  },
  "infoURL": "http://hizoco.net",
  "chainId": 80096,
  "networkId": 80096,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://hizoco.net:38443",
      "standard": "none"
    }
  ]
} satisfies Chain