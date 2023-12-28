/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7777777 = {
  "name": "Zora",
  "shortName": "zora",
  "chain": "ETH",
  "icon": "zora",
  "rpc": [
    "https://rpc.zora.energy/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zora.energy",
  "chainId": 7777777,
  "networkId": 7777777,
  "explorers": [
    {
      "name": "Zora Network Explorer",
      "url": "https://explorer.zora.energy",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain