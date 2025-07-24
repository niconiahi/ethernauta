/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3306 = {
  "name": "Debounce Subnet Testnet",
  "shortName": "debounce-devnet",
  "chain": "Debounce Network",
  "icon": "debounce",
  "rpc": [
    "https://dev-rpc.debounce.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Debounce Network",
    "symbol": "DB",
    "decimals": 18
  },
  "infoURL": "https://debounce.network",
  "chainId": 3306,
  "networkId": 3306,
  "slip44": 1,
  "explorers": [
    {
      "name": "Debounce Devnet Explorer",
      "url": "https://explorer.debounce.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain