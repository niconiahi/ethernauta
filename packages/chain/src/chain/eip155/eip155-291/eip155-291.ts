/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_291 = {
  "name": "Orderly Mainnet",
  "shortName": "orderly",
  "chain": "ETH",
  "icon": "orderly",
  "rpc": [
    "https://rpc.orderly.network",
    "https://l2-orderly-mainnet-0.t.conduit.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "www.orderly.network",
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