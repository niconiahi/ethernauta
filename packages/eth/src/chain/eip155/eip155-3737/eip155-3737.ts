/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3737 = {
  "name": "Crossbell",
  "shortName": "csb",
  "chain": "Crossbell",
  "icon": "crossbell",
  "rpc": [
    "https://rpc.crossbell.io"
  ],
  "faucets": [
    "https://faucet.crossbell.io"
  ],
  "nativeCurrency": {
    "name": "Crossbell Token",
    "symbol": "CSB",
    "decimals": 18
  },
  "infoURL": "https://crossbell.io",
  "chainId": 3737,
  "networkId": 3737,
  "explorers": [
    {
      "name": "Crossbell Explorer",
      "url": "https://scan.crossbell.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain