/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_634 = {
  "name": "Avocado",
  "shortName": "avocado",
  "chain": "Avocado",
  "icon": "avocado",
  "rpc": [
    "https://rpc.avocado.instadapp.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USDC",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://avocado.instadapp.io",
  "chainId": 634,
  "networkId": 634,
  "explorers": [
    {
      "name": "avoscan",
      "url": "https://avoscan.co",
      "standard": "none"
    }
  ]
} satisfies Chain