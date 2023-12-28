/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1972 = {
  "name": "RedeCoin",
  "shortName": "rede",
  "chain": "REDEV2",
  "rpc": [
    "https://rpc2.redecoin.eu"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "RedeCoin",
    "symbol": "REDEV2",
    "decimals": 18
  },
  "infoURL": "https://www.redecoin.eu",
  "chainId": 1972,
  "networkId": 1972,
  "explorers": [
    {
      "name": "RedeCoin Explorer",
      "url": "https://explorer3.redecoin.eu",
      "standard": "none"
    }
  ]
} satisfies Chain