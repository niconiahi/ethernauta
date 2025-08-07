/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1370 = {
  "name": "Ramestta Mainnet",
  "shortName": "RAMA",
  "chain": "Ramestta",
  "icon": "ramestta",
  "rpc": [
    "https://blockchain.ramestta.com",
    "https://blockchain2.ramestta.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rama",
    "symbol": "RAMA",
    "decimals": 18
  },
  "infoURL": "https://www.ramestta.com",
  "chainId": 1370,
  "networkId": 1370,
  "explorers": [
    {
      "name": "ramascan",
      "url": "https://ramascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain