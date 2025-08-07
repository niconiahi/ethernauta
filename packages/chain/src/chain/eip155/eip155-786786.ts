/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_786786 = {
  "name": "Zebro Smart Chain",
  "shortName": "zebro",
  "chain": "ZEBRO",
  "icon": "zebrocoin",
  "rpc": [
    "https://rpc.zebrocoin.app",
    "https://rpc1.zebrocoin.app"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zebrocoin",
    "symbol": "ZEBRO",
    "decimals": 18
  },
  "infoURL": "https://zebrocoin.app",
  "chainId": 786786,
  "networkId": 786786,
  "explorers": [
    {
      "name": "Zebrocoin Explorer",
      "url": "https://explorer.zebrocoin.app",
      "standard": "EIP3091"
    },
    {
      "name": "Zebrocoin Explorer1",
      "url": "https://explorer1.zebrocoin.app",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain