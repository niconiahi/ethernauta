/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1514 = {
  "name": "Story",
  "shortName": "sty",
  "chain": "STORY",
  "icon": "story",
  "rpc": [
    "https://mainnet.storyrpc.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "IP Token",
    "symbol": "IP",
    "decimals": 18
  },
  "infoURL": "https://story.foundation/",
  "chainId": 1514,
  "networkId": 1514,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://mainnet.storyscan.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain