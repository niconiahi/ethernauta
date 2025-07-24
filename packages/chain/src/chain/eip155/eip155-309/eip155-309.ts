/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_309 = {
  "name": "Wyzth Testnet",
  "shortName": "wyz",
  "chain": "WYZ",
  "icon": "wyzth_icon",
  "rpc": [
    "https://rpc-testnet3.wyzthchain.org/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Wyzth",
    "symbol": "WYZ",
    "decimals": 18
  },
  "infoURL": "https://wyzth.org/",
  "chainId": 309,
  "networkId": 309,
  "slip44": 1,
  "explorers": [
    {
      "name": "wyzth",
      "url": "http://24.199.108.65:4000",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain