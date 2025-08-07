/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_21004 = {
  "name": "C4EI",
  "shortName": "c4ei",
  "chain": "C4EI",
  "rpc": [
    "https://rpc.c4ei.net"
  ],
  "faucets": [
    "https://play.google.com/store/apps/details?id=net.c4ei.fps2"
  ],
  "nativeCurrency": {
    "name": "C4EI",
    "symbol": "C4EI",
    "decimals": 18
  },
  "infoURL": "https://c4ei.net",
  "chainId": 21004,
  "networkId": 21004,
  "explorers": [
    {
      "name": "C4EI sirato",
      "url": "https://exp.c4ei.net",
      "standard": "none"
    }
  ]
} satisfies Chain