/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_641230 = {
  "name": "Bear Network Chain Mainnet",
  "shortName": "BRNKC",
  "chain": "BRNKC",
  "icon": "brnkc",
  "rpc": [
    "https://brnkc-mainnet.bearnetwork.net",
    "https://brnkc-mainnet1.bearnetwork.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bear Network Chain Native Token",
    "symbol": "BRNKC",
    "decimals": 18
  },
  "infoURL": "https://bearnetwork.net",
  "chainId": 641230,
  "networkId": 641230,
  "explorers": [
    {
      "name": "brnkscan",
      "url": "https://brnkscan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain