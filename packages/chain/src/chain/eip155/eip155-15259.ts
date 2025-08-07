/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_15259 = {
  "name": "Poodl Mainnet",
  "shortName": "poodle",
  "chain": "Poodl",
  "icon": "poodlIcon",
  "rpc": [
    "https://rpc.poodl.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Poodl",
    "symbol": "POODL",
    "decimals": 18
  },
  "infoURL": "https://poodl.org",
  "chainId": 15259,
  "networkId": 15259,
  "explorers": [
    {
      "name": "Poodl Mainnet Explorer",
      "url": "https://explorer.poodl.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain