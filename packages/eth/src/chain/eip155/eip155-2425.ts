/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2425 = {
  "name": "King Of Legends Mainnet",
  "shortName": "kcc",
  "title": "King Of Legends Mainnet",
  "chain": "KCC",
  "icon": "kol",
  "rpc": [
    "https://rpc-mainnet.kinggamer.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "King Of Legends",
    "symbol": "KCC",
    "decimals": 18
  },
  "infoURL": "https://kingoflegends.net/",
  "chainId": 2425,
  "networkId": 2425,
  "slip44": 1,
  "explorers": [
    {
      "name": "King Of Legends Mainnet Explorer",
      "url": "https://kingscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain