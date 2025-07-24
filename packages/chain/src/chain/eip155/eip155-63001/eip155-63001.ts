/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_63001 = {
  "name": "eCredits Testnet",
  "shortName": "ecs-testnet",
  "chain": "ECS",
  "icon": "ecredits",
  "rpc": [
    "https://rpc.tst.ecredits.com"
  ],
  "faucets": [
    "https://faucet.tst.ecredits.com"
  ],
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "infoURL": "https://ecredits.com",
  "chainId": 63001,
  "networkId": 63001,
  "slip44": 1,
  "explorers": [
    {
      "name": "eCredits TestNet Explorer",
      "url": "https://explorer.tst.ecredits.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain