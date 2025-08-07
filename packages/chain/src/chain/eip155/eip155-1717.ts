/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1717 = {
  "name": "Doric Network",
  "shortName": "DRC",
  "chain": "DRC",
  "icon": "doric",
  "rpc": [
    "https://mainnet.doric.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Doric Native Token",
    "symbol": "DRC",
    "decimals": 18
  },
  "infoURL": "https://doric.network",
  "chainId": 1717,
  "networkId": 1717,
  "explorers": [
    {
      "name": "Doric Explorer",
      "url": "https://explorer.doric.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain