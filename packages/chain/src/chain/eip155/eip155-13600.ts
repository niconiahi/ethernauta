/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_13600 = {
  "name": "Kronobit Mainnet",
  "shortName": "KNB",
  "title": "Kronobit Mainnet",
  "chain": "KNB",
  "icon": "kronobit",
  "rpc": [
    "https://mainnet-rpc.qbitscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kronobit",
    "symbol": "KNB",
    "decimals": 18
  },
  "infoURL": "https://kronobit.org",
  "chainId": 13600,
  "networkId": 13600,
  "explorers": [
    {
      "name": "qbitscan",
      "url": "https://explorer.qbitscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain