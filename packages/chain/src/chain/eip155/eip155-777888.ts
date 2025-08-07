/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_777888 = {
  "name": "Oone Chain Mainnet",
  "shortName": "oone",
  "chain": "OONE",
  "rpc": [
    "https://rpc.oonechain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OONE",
    "symbol": "OONE",
    "decimals": 18
  },
  "infoURL": "https://oonechain.com",
  "chainId": 777888,
  "networkId": 777888,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://oonescan.com",
      "standard": "none"
    }
  ]
} satisfies Chain