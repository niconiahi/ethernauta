/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_97531 = {
  "name": "Green Chain Testnet",
  "shortName": "greenchain",
  "chain": "Green Chain",
  "icon": "greenchain",
  "rpc": [
    "https://node.greenchain.app/rpc/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GREEN",
    "symbol": "GREEN",
    "decimals": 18
  },
  "infoURL": "https://www.greenchain.app",
  "chainId": 97531,
  "networkId": 97531,
  "explorers": [
    {
      "name": "Green Chain Explorer",
      "url": "https://explorer.greenchain.app",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain