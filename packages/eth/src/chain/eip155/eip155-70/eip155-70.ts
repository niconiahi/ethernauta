/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_70 = {
  "name": "Hoo Smart Chain",
  "shortName": "hsc",
  "chain": "HSC",
  "rpc": [
    "https://http-mainnet.hoosmartchain.com",
    "https://http-mainnet2.hoosmartchain.com",
    "wss://ws-mainnet.hoosmartchain.com",
    "wss://ws-mainnet2.hoosmartchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Hoo Smart Chain Native Token",
    "symbol": "HOO",
    "decimals": 18
  },
  "infoURL": "https://www.hoosmartchain.com",
  "chainId": 70,
  "networkId": 70,
  "slip44": 1170,
  "explorers": [
    {
      "name": "hooscan",
      "url": "https://www.hooscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain