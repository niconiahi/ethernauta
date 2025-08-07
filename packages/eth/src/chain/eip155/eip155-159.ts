/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_159 = {
  "name": "Roburna Testnet",
  "shortName": "rbat",
  "chain": "RBAT",
  "icon": "roburna",
  "rpc": [
    "https://preseed-testnet-1.roburna.com"
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
    "name": "Roburna",
    "symbol": "RBAT",
    "decimals": 18
  },
  "infoURL": "https://www.roburna.com/",
  "chainId": 159,
  "networkId": 159,
  "explorers": [
    {
      "name": "Rbascan Testnet Explorer",
      "url": "https://testnet.rbascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain