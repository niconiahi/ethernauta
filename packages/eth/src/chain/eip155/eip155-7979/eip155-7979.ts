/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7979 = {
  "name": "DOS Chain",
  "shortName": "dos",
  "chain": "DOS",
  "icon": "doschain",
  "rpc": [
    "https://main.doschain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DOS",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "https://doschain.io",
  "chainId": 7979,
  "networkId": 7979,
  "explorers": [
    {
      "name": "DOScan",
      "url": "https://doscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain