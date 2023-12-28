/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_246 = {
  "name": "Energy Web Chain",
  "shortName": "ewt",
  "chain": "Energy Web Chain",
  "rpc": [
    "https://rpc.energyweb.org",
    "wss://rpc.energyweb.org/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Energy Web Token",
    "symbol": "EWT",
    "decimals": 18
  },
  "infoURL": "https://energyweb.org",
  "chainId": 246,
  "networkId": 246,
  "slip44": 246,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.energyweb.org",
      "standard": "none"
    }
  ]
} satisfies Chain