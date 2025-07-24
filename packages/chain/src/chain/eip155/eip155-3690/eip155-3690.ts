/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3690 = {
  "name": "Bittex Mainnet",
  "shortName": "btx",
  "chain": "BTX",
  "rpc": [
    "https://rpc1.bittexscan.info",
    "https://rpc2.bittexscan.info"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bittex",
    "symbol": "BTX",
    "decimals": 18
  },
  "infoURL": "https://bittexscan.com",
  "chainId": 3690,
  "networkId": 3690,
  "explorers": [
    {
      "name": "bittexscan",
      "url": "https://bittexscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain