/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1875 = {
  "name": "Whitechain",
  "shortName": "wbt",
  "chain": "WBT",
  "icon": "whitechain",
  "rpc": [
    "https://rpc.whitechain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "infoURL": "https://whitechain.io",
  "chainId": 1875,
  "networkId": 1875,
  "explorers": [
    {
      "name": "whitechain-explorer",
      "url": "https://explorer.whitechain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain