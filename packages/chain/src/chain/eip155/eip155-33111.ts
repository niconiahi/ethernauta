/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_33111 = {
  "name": "Curtis",
  "shortName": "curtis",
  "chain": "Curtis",
  "icon": "curtis",
  "rpc": [
    "https://rpc.curtis.apechain.com"
  ],
  "faucets": [
    "https://curtis.hub.caldera.xyz"
  ],
  "nativeCurrency": {
    "name": "ApeCoin",
    "symbol": "APE",
    "decimals": 18
  },
  "infoURL": "https://curtis.hub.caldera.xyz",
  "chainId": 33111,
  "networkId": 33111,
  "explorers": [
    {
      "name": "Curtis Explorer",
      "url": "https://explorer.curtis.apechain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain