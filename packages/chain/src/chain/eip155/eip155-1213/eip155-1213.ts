/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1213 = {
  "name": "Popcateum Mainnet",
  "shortName": "popcat",
  "chain": "POPCATEUM",
  "rpc": [
    "https://dataseed.popcateum.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Popcat",
    "symbol": "POP",
    "decimals": 18
  },
  "infoURL": "https://popcateum.org",
  "chainId": 1213,
  "networkId": 1213,
  "explorers": [
    {
      "name": "popcateum explorer",
      "url": "https://explorer.popcateum.org",
      "standard": "none"
    }
  ]
} satisfies Chain