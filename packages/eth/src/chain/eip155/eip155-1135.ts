/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1135 = {
  "name": "Lisk",
  "shortName": "lisk",
  "chain": "ETH",
  "icon": "lisk",
  "rpc": [
    "https://rpc.api.lisk.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lisk.com",
  "chainId": 1135,
  "networkId": 1135,
  "slip44": 134,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.lisk.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain