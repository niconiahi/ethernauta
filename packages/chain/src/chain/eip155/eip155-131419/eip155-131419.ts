/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_131419 = {
  "name": "ETND Chain Mainnets",
  "shortName": "ETND",
  "chain": "ETND",
  "icon": "ETND",
  "rpc": [
    "https://rpc.node1.etnd.pro/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETND",
    "symbol": "ETND",
    "decimals": 18
  },
  "infoURL": "https://www.etnd.pro",
  "chainId": 131419,
  "networkId": 131419,
  "explorers": [
    {
      "name": "etndscan",
      "url": "https://scan.etnd.pro",
      "standard": "none"
    }
  ]
} satisfies Chain