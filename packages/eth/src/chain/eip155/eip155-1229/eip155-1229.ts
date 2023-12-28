/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1229 = {
  "name": "Exzo Network Mainnet",
  "shortName": "xzo",
  "chain": "EXZO",
  "icon": "exzo",
  "rpc": [
    "https://mainnet.exzo.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Exzo",
    "symbol": "XZO",
    "decimals": 18
  },
  "infoURL": "https://exzo.network",
  "chainId": 1229,
  "networkId": 1229,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exzoscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain