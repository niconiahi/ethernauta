/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_34504 = {
  "name": "ZEUS Mainnet",
  "shortName": "ZEUSX",
  "chain": "ZEUSX",
  "icon": "zeusicon",
  "rpc": [
    "https://mainnet-rpc.zeuschainscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "The ZEUS Token",
    "symbol": "ZEUSX",
    "decimals": 18
  },
  "infoURL": "https://zeuschainscan.io",
  "chainId": 34504,
  "networkId": 34504,
  "explorers": [
    {
      "name": "ZEUS Mainnet Explorer",
      "url": "https://zeuschainscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain