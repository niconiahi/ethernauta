/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11451 = {
  "name": "eGold Chain",
  "shortName": "egoldchain",
  "chain": "EGC",
  "icon": "egoldchain",
  "rpc": [
    "https://rpc.egoldchain.com",
    "wss://rpc.egoldchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Aurum",
    "symbol": "XAU",
    "decimals": 18
  },
  "infoURL": "https://www.egoldchain.com",
  "chainId": 11451,
  "networkId": 11451,
  "explorers": [
    {
      "name": "eGold Chain Block Explorer",
      "url": "https://egoldscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain