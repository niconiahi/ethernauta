/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1377 = {
  "name": "Pingaksha testnet",
  "shortName": "tRAMA",
  "chain": "Pingaksha",
  "icon": "ramestta",
  "rpc": [
    "https://testnet.ramestta.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rama",
    "symbol": "tRAMA",
    "decimals": 18
  },
  "infoURL": "https://www.ramestta.com",
  "chainId": 1377,
  "networkId": 1377,
  "explorers": [
    {
      "name": "Pingaksha",
      "url": "https://pingaksha.ramascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain