/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7788 = {
  "name": "Draw Coin",
  "shortName": "drw",
  "chain": "DRW",
  "icon": "drawchain",
  "rpc": [
    "https://rpc.drawchain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DRW",
    "symbol": "DRW",
    "decimals": 18
  },
  "infoURL": "https://drawchain.io/",
  "chainId": 7788,
  "networkId": 7788,
  "explorers": [
    {
      "name": "Draw Chain Explorer",
      "url": "https://drawscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain