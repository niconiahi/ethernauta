/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_861 = {
  "name": "Electra Network",
  "shortName": "elc",
  "chain": "Electra",
  "rpc": [
    "https://rpc.electranetwork.tech"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Electra",
    "symbol": "ELC",
    "decimals": 18
  },
  "infoURL": "https://www.electranetwork.tech",
  "chainId": 861,
  "networkId": 861,
  "explorers": [
    {
      "name": "Electra Explorer",
      "url": "https://scan.electranetwork.tech",
      "standard": "none"
    }
  ]
} satisfies Chain