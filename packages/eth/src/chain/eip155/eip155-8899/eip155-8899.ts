/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8899 = {
  "name": "JIBCHAIN L1",
  "shortName": "jbc",
  "chain": "JBC",
  "icon": "jbc",
  "rpc": [
    "https://rpc-l1.jibchain.net",
    "https://jib-rpc.inan.in.th"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "JIBCOIN",
    "symbol": "JBC",
    "decimals": 18
  },
  "infoURL": "https://jibchain.net",
  "chainId": 8899,
  "networkId": 8899,
  "explorers": [
    {
      "name": "JIBCHAIN Explorer",
      "url": "https://exp-l1.jibchain.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain