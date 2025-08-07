/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8118 = {
  "name": "Shardeum",
  "shortName": "Shardeum",
  "chain": "Shardeum",
  "icon": "shardeum",
  "rpc": [
    "https://api.shardeum.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shardeum",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "chainId": 8118,
  "networkId": 8118,
  "explorers": [
    {
      "name": "Shardeum Explorer",
      "url": "https://explorer.shardeum.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain