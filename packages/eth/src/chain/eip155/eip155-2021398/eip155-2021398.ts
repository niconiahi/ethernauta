/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2021398 = {
  "name": "DeBank Testnet",
  "shortName": "dbk",
  "chain": "DeBank",
  "icon": "debank",
  "rpc": [
    "http://rpc.testnet.debank.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DeBank USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://debank.com",
  "chainId": 2021398,
  "networkId": 2021398,
  "slip44": 1,
  "explorers": [
    {
      "name": "DeBank Chain Explorer",
      "url": "https://explorer.testnet.debank.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain