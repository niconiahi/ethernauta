/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_168 = {
  "name": "AIOZ Network",
  "shortName": "aioz",
  "chain": "AIOZ",
  "icon": "aioz",
  "rpc": [
    "https://eth-dataseed.aioz.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AIOZ",
    "symbol": "AIOZ",
    "decimals": 18
  },
  "infoURL": "https://aioz.network",
  "chainId": 168,
  "networkId": 168,
  "slip44": 60,
  "explorers": [
    {
      "name": "AIOZ Network Explorer",
      "url": "https://explorer.aioz.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain