/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_17171 = {
  "name": "G8Chain Mainnet",
  "shortName": "G8Cm",
  "chain": "G8C",
  "icon": "G8Chain",
  "rpc": [
    "https://mainnet-rpc.oneg8.network"
  ],
  "faucets": [
    "https://faucet.oneg8.network"
  ],
  "nativeCurrency": {
    "name": "G8Chain",
    "symbol": "G8C",
    "decimals": 18
  },
  "infoURL": "https://oneg8.one",
  "chainId": 17171,
  "networkId": 17171,
  "explorers": [
    {
      "name": "G8Chain",
      "url": "https://mainnet.oneg8.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain