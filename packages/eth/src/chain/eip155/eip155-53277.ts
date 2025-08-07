/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_53277 = {
  "name": "DOID",
  "shortName": "DOID",
  "chain": "DOID",
  "icon": "doid",
  "rpc": [
    "https://rpc.doid.tech"
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
    "name": "DOID",
    "symbol": "DOID",
    "decimals": 18
  },
  "infoURL": "https://doid.tech",
  "chainId": 53277,
  "networkId": 53277,
  "explorers": [
    {
      "name": "DOID Scan",
      "url": "https://scan.doid.tech",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain