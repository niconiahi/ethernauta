/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6119 = {
  "name": "UPTN",
  "shortName": "UPTN",
  "chain": "UPTN",
  "icon": "uptn",
  "rpc": [
    "https://node-api.uptn.io/v1/ext/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "UPTN",
    "symbol": "UPTN",
    "decimals": 18
  },
  "infoURL": "https://uptn.io",
  "chainId": 6119,
  "networkId": 6119,
  "explorers": [
    {
      "name": "UPTN Explorer",
      "url": "https://explorer.uptn.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain