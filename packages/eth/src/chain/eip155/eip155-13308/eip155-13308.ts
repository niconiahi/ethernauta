/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_13308 = {
  "name": "Credit Smart Chain",
  "shortName": "Credit",
  "chain": "CREDIT",
  "icon": "credit",
  "rpc": [
    "https://rpc.creditsmartchain.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Credit",
    "symbol": "CREDIT",
    "decimals": 18
  },
  "infoURL": "https://creditsmartchain.com",
  "chainId": 13308,
  "networkId": 13308,
  "explorers": [
    {
      "name": "Creditscan",
      "url": "https://scan.creditsmartchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain