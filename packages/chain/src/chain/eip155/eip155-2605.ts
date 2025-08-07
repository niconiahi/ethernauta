/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2605 = {
  "name": "Pho Blockchain Mainnet",
  "shortName": "pho",
  "chain": "PHO",
  "icon": "pho",
  "rpc": [
    "https://mainnet.phochain.org"
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
    "name": "Pho",
    "symbol": "PHO",
    "decimals": 18
  },
  "infoURL": "phochain.org",
  "chainId": 2605,
  "networkId": 2605,
  "explorers": [
    {
      "name": "Pho Scan",
      "url": "https://phoscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain