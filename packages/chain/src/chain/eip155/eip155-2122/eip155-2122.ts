/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2122 = {
  "name": "Metaplayerone Mainnet",
  "shortName": "Metad",
  "chain": "METAD",
  "icon": "metad",
  "rpc": [
    "https://rpc.metaplayer.one/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "METAD",
    "symbol": "METAD",
    "decimals": 18
  },
  "infoURL": "https://docs.metaplayer.one/",
  "chainId": 2122,
  "networkId": 2122,
  "explorers": [
    {
      "name": "Metad Scan",
      "url": "https://scan.metaplayer.one",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain