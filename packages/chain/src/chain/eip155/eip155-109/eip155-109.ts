/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_109 = {
  "name": "Shibarium",
  "shortName": "shibariumecosystem",
  "chain": "Shibarium",
  "icon": "shibarium",
  "rpc": [
    "https://www.shibrpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BONE Shibarium",
    "symbol": "BONE",
    "decimals": 18
  },
  "infoURL": "https://shibariumecosystem.com",
  "chainId": 109,
  "networkId": 109,
  "explorers": [
    {
      "name": "shibariumscan",
      "url": "https://www.shibariumscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain