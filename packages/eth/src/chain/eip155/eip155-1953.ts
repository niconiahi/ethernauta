/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1953 = {
  "name": "Selendra Network Testnet",
  "shortName": "tSEL",
  "chain": "tSEL",
  "icon": "selendra",
  "rpc": [
    "https://rpc-testnet.selendra.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Selendra",
    "symbol": "tSEL",
    "decimals": 18
  },
  "infoURL": "https://selendra.org",
  "chainId": 1953,
  "networkId": 1953,
  "explorers": [
    {
      "name": "Selendra Portal",
      "url": "https://explorer.selendra.org",
      "standard": "none"
    }
  ]
} satisfies Chain