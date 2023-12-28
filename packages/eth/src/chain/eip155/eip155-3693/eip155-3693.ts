/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3693 = {
  "name": "Empire Network",
  "shortName": "empire",
  "chain": "EMPIRE",
  "rpc": [
    "https://rpc.empirenetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Empire",
    "symbol": "EMPIRE",
    "decimals": 18
  },
  "infoURL": "https://www.empirenetwork.io/",
  "chainId": 3693,
  "networkId": 3693,
  "explorers": [
    {
      "name": "Empire Explorer",
      "url": "https://explorer.empirenetwork.io",
      "standard": "none"
    }
  ]
} satisfies Chain