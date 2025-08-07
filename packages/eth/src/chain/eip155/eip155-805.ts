/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_805 = {
  "name": "Evoz Mainnet",
  "shortName": "Evoz",
  "chain": "Evoz",
  "icon": "evoz",
  "rpc": [
    "https://rpc.evozscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Evoz Mainnet",
    "symbol": "EVOZ",
    "decimals": 18
  },
  "infoURL": "https://rpc.evozscan.com",
  "chainId": 805,
  "networkId": 805,
  "explorers": [
    {
      "name": "evozscan",
      "url": "https://evozscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain