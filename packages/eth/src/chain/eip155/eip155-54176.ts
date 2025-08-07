/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_54176 = {
  "name": "OverProtocol Mainnet",
  "shortName": "overprotocol",
  "chain": "OverProtocol",
  "icon": "overIcon",
  "rpc": [
    "https://rpc.overprotocol.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Over",
    "symbol": "OVER",
    "decimals": 18
  },
  "infoURL": "https://docs.over.network",
  "chainId": 54176,
  "networkId": 54176,
  "explorers": [
    {
      "name": "OverView",
      "url": "https://scan.over.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain