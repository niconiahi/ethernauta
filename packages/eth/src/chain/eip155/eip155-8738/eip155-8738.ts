/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8738 = {
  "name": "Alph Network",
  "shortName": "alph",
  "chain": "ALPH",
  "rpc": [
    "https://rpc.alph.network",
    "wss://rpc.alph.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Alph Network",
    "symbol": "ALPH",
    "decimals": 18
  },
  "infoURL": "https://alph.network",
  "chainId": 8738,
  "networkId": 8738,
  "explorers": [
    {
      "name": "alphscan",
      "url": "https://explorer.alph.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain