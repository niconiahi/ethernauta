/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_192837465 = {
  "name": "Gather Mainnet Network",
  "shortName": "GTH",
  "chain": "GTH",
  "icon": "gather",
  "rpc": [
    "https://mainnet.gather.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "chainId": 192837465,
  "networkId": 192837465,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.gather.network",
      "standard": "none"
    }
  ]
} satisfies Chain