/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1315 = {
  "name": "Story Aeneid Testnet",
  "shortName": "story-aeneid",
  "chain": "Story Aeneid Testnet",
  "icon": "story",
  "rpc": [
    "https://aeneid.storyrpc.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "IP Token",
    "symbol": "IP",
    "decimals": 18
  },
  "infoURL": "https://story.foundation/",
  "chainId": 1315,
  "networkId": 1315,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://aeneid.storyscan.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain