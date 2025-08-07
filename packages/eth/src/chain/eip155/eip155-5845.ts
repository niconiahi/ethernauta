/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5845 = {
  "name": "Tangle",
  "shortName": "tangle",
  "chain": "Tangle",
  "icon": "tangle",
  "rpc": [
    "https://rpc.tangle.tools",
    "wss://rpc.tangle.tools"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tangle",
    "symbol": "TNT",
    "decimals": 18
  },
  "infoURL": "https://docs.tangle.tools",
  "chainId": 5845,
  "networkId": 5845,
  "explorers": [
    {
      "name": "Tangle EVM Explorer",
      "url": "https://explorer.tangle.tools",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain