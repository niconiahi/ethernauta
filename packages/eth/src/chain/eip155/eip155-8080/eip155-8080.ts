/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8080 = {
  "name": "Shardeum Liberty 1.X",
  "shortName": "Liberty10",
  "chain": "Shardeum",
  "icon": "shardeum",
  "rpc": [
    "https://liberty10.shardeum.org/"
  ],
  "faucets": [
    "https://faucet.liberty10.shardeum.org"
  ],
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "chainId": 8080,
  "networkId": 8080,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-liberty10.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain