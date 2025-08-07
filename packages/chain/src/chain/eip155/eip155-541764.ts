/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_541764 = {
  "name": "OverProtocol Testnet",
  "shortName": "overprotocol-testnet",
  "chain": "OverProtocol",
  "icon": "overIcon",
  "rpc": [
    "https://rpc.dolphin.overprotocol.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Over",
    "symbol": "OVER",
    "decimals": 18
  },
  "infoURL": "https://docs.over.network",
  "chainId": 541764,
  "networkId": 541764,
  "explorers": [
    {
      "name": "OverView Testnet",
      "url": "https://dolphin-scan.over.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain