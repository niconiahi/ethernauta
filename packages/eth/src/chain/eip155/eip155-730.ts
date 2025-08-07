/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_730 = {
  "name": "Lovely Network Mainnet",
  "shortName": "LOVELY",
  "chain": "Lovely",
  "icon": "lovely",
  "rpc": [
    "https://rpc.lovely.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Lovely",
    "symbol": "LOVELY",
    "decimals": 18
  },
  "infoURL": "https://lovely.network",
  "chainId": 730,
  "networkId": 730,
  "explorers": [
    {
      "name": "Lovely Network Mainnet",
      "url": "https://scan.lovely.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain