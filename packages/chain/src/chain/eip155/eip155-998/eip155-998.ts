/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_998 = {
  "name": "Lucky Network",
  "shortName": "ln",
  "chain": "LN",
  "icon": "lucky",
  "rpc": [
    "https://rpc.luckynetwork.org",
    "wss://ws.lnscan.org",
    "https://rpc.lnscan.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Lucky",
    "symbol": "L99",
    "decimals": 18
  },
  "infoURL": "https://luckynetwork.org",
  "chainId": 998,
  "networkId": 998,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.luckynetwork.org",
      "standard": "none"
    },
    {
      "name": "expedition",
      "url": "https://lnscan.org",
      "standard": "none"
    }
  ]
} satisfies Chain