/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1170 = {
  "name": "Origin Testnet",
  "shortName": "auoc",
  "chain": "Origin",
  "icon": "origin",
  "rpc": [
    "https://json-rpc.origin.uptick.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Origin",
    "symbol": "UOC",
    "decimals": 18
  },
  "infoURL": "https://www.uptick.network",
  "chainId": 1170,
  "networkId": 1170,
  "slip44": 1,
  "explorers": [
    {
      "name": "Origin Explorer",
      "url": "https://evm-explorer.origin.uptick.network",
      "standard": "none"
    }
  ]
} satisfies Chain