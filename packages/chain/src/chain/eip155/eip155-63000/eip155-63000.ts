/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_63000 = {
  "name": "eCredits Mainnet",
  "shortName": "ecs",
  "chain": "ECS",
  "icon": "ecredits",
  "rpc": [
    "https://rpc.ecredits.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "infoURL": "https://ecredits.com",
  "chainId": 63000,
  "networkId": 63000,
  "explorers": [
    {
      "name": "eCredits MainNet Explorer",
      "url": "https://explorer.ecredits.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain