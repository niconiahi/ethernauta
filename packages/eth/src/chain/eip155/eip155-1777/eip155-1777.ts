/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1777 = {
  "name": "Gauss Mainnet",
  "shortName": "gauss",
  "chain": "Gauss",
  "icon": "gauss",
  "rpc": [
    "https://rpc.gaussgang.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GANG",
    "symbol": "GANG",
    "decimals": 18
  },
  "infoURL": "https://gaussgang.com/",
  "chainId": 1777,
  "networkId": 1777,
  "explorers": [
    {
      "name": "Gauss Explorer",
      "url": "https://explorer.gaussgang.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain