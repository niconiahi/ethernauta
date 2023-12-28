/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_41500 = {
  "name": "Opulent-X BETA",
  "shortName": "ox-beta",
  "chain": "Opulent-X",
  "rpc": [
    "https://connect.opulent-x.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Oxyn Gas",
    "symbol": "OXYN",
    "decimals": 18
  },
  "infoURL": "https://beta.opulent-x.com",
  "chainId": 41500,
  "networkId": 41500,
  "explorers": [
    {
      "name": "Opulent-X BETA Explorer",
      "url": "https://explorer.opulent-x.com",
      "standard": "none"
    }
  ]
} satisfies Chain