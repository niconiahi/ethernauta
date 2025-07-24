/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9980 = {
  "name": "Combo Mainnet",
  "shortName": "combo-mainnet",
  "chain": "Combo",
  "icon": "combo",
  "rpc": [
    "https://rpc.combonetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://combonetwork.io",
  "chainId": 9980,
  "networkId": 9980,
  "explorers": [
    {
      "name": "combotrace explorer",
      "url": "https://combotrace.nodereal.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain