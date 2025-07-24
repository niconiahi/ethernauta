/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8081 = {
  "name": "Shardeum Liberty 2.X",
  "shortName": "Liberty20",
  "chain": "Shardeum",
  "icon": "shardeum",
  "rpc": [
    "https://liberty20.shardeum.org/"
  ],
  "faucets": [
    "https://faucet.liberty20.shardeum.org"
  ],
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "chainId": 8081,
  "networkId": 8081,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-liberty20.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain