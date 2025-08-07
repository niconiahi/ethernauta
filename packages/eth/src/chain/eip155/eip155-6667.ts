/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6667 = {
  "name": "Storchain",
  "shortName": "str",
  "chain": "STR",
  "icon": "str",
  "rpc": [
    "https://rpc.storchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Storchain",
    "symbol": "STR",
    "decimals": 18
  },
  "infoURL": "https://storchain.io",
  "chainId": 6667,
  "networkId": 6667,
  "explorers": [
    {
      "name": "storscan",
      "url": "https://scan.storchain.io",
      "standard": "none"
    }
  ]
} satisfies Chain