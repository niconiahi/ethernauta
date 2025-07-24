/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1898 = {
  "name": "BON Network",
  "shortName": "boya",
  "chain": "BON",
  "rpc": [
    "http://rpc.boyanet.org:8545",
    "ws://rpc.boyanet.org:8546"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BOYACoin",
    "symbol": "BOY",
    "decimals": 18
  },
  "infoURL": "https://boyanet.org",
  "chainId": 1898,
  "networkId": 1,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.boyanet.org:4001",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain