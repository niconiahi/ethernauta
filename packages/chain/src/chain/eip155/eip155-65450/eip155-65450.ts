/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_65450 = {
  "name": "Scolcoin Mainnet",
  "shortName": "SRC",
  "chain": "SCOLWEI",
  "icon": "scolcoin",
  "rpc": [
    "https://mainnet-rpc.scolcoin.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Scolcoin",
    "symbol": "SCOL",
    "decimals": 18
  },
  "infoURL": "https://scolcoin.com",
  "chainId": 65450,
  "networkId": 65450,
  "explorers": [
    {
      "name": "Scolscan Explorer",
      "url": "https://explorer.scolcoin.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain