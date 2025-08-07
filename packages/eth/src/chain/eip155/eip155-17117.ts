/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_17117 = {
  "name": "DeFiVerse Testnet",
  "shortName": "DFV-testnet",
  "chain": "DeFiVerse Testnet",
  "icon": "defiverse",
  "rpc": [
    "https://rpc-testnet.defi-verse.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Oasys",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://defi-verse.org",
  "chainId": 17117,
  "networkId": 17117,
  "explorers": [
    {
      "name": "DeFiVerse Testnet Explorer",
      "url": "https://scan-testnet.defi-verse.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain