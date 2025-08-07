/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_20041 = {
  "name": "Niza Chain Mainnet",
  "shortName": "niza",
  "chain": "NIZA",
  "icon": "niza",
  "rpc": [
    "https://nizascan.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Niza Global",
    "symbol": "NIZA",
    "decimals": 18
  },
  "infoURL": "https://niza.io",
  "chainId": 20041,
  "networkId": 20041,
  "explorers": [
    {
      "name": "NizaScan",
      "url": "https://nizascan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain