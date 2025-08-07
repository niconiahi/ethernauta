/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8008 = {
  "name": "Polynomial",
  "shortName": "polynomial",
  "chain": "Polynomial",
  "icon": "polynomial",
  "rpc": [
    "https://rpc.polynomial.fi"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://polynomial.fi",
  "chainId": 8008,
  "networkId": 8008,
  "explorers": [
    {
      "name": "Polynomial Explorer",
      "url": "https://polynomialscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain