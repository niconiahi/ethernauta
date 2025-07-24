/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_91715 = {
  "name": "Combo Testnet",
  "shortName": "combo-testnet",
  "chain": "Combo",
  "icon": "combo",
  "rpc": [
    "https://test-rpc.combonetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "tcBNB",
    "decimals": 18
  },
  "infoURL": "https://combonetwork.io",
  "chainId": 91715,
  "networkId": 91715,
  "explorers": [
    {
      "name": "combotrace explorer",
      "url": "https://combotrace-testnet.nodereal.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain