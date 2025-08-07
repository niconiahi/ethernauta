/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_291 = {
  "name": "Orderly Mainnet",
  "shortName": "orderly",
  "chain": "ETH",
  "icon": "orderly",
  "rpc": [
    "https://rpc.orderly.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://orderly.network/",
  "chainId": 291,
  "networkId": 291,
  "explorers": [
    {
      "name": "orderlyscout",
      "url": "https://explorer.orderly.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain