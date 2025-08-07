/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2140 = {
  "name": "Oneness Network",
  "shortName": "oneness",
  "chain": "Oneness",
  "rpc": [
    "https://rpc.onenesslabs.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 2140,
  "networkId": 2140,
  "explorers": [
    {
      "name": "oneness-mainnet",
      "url": "https://scan.onenesslabs.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain