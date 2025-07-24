/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_210 = {
  "name": "Bitnet",
  "shortName": "BTN",
  "chain": "BTN",
  "icon": "bitnet",
  "rpc": [
    "https://rpc.bitnet.money",
    "https://rpc.btnscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitnet",
    "symbol": "BTN",
    "decimals": 18
  },
  "infoURL": "https://bitnet.money",
  "chainId": 210,
  "networkId": 210,
  "explorers": [
    {
      "name": "Bitnet Explorer",
      "url": "https://btnscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain