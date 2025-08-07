/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8811 = {
  "name": "Haven1",
  "shortName": "haven1",
  "chain": "haven1",
  "icon": "haven1",
  "rpc": [
    "https://rpc.haven1.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Haven1",
    "symbol": "H1",
    "decimals": 18
  },
  "infoURL": "https://www.haven1.org",
  "chainId": 8811,
  "networkId": 8811,
  "explorers": [
    {
      "name": "Haven1 Explorer",
      "url": "https://explorer.haven1.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain