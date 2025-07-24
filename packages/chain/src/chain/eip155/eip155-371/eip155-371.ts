/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_371 = {
  "name": "Consta Testnet",
  "shortName": "tCNT",
  "chain": "tCNT",
  "icon": "constachain",
  "rpc": [
    "https://rpc-testnet.theconsta.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "tCNT",
    "symbol": "tCNT",
    "decimals": 18
  },
  "infoURL": "http://theconsta.com",
  "chainId": 371,
  "networkId": 371,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-testnet.theconsta.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain