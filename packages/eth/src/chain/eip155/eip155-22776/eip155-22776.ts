/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_22776 = {
  "name": "MAP Mainnet",
  "shortName": "map",
  "chain": "MAP",
  "icon": "map",
  "rpc": [
    "https://rpc.maplabs.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MAPO",
    "symbol": "MAPO",
    "decimals": 18
  },
  "infoURL": "https://maplabs.io",
  "chainId": 22776,
  "networkId": 22776,
  "slip44": 60,
  "explorers": [
    {
      "name": "mapscan",
      "url": "https://mapscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain