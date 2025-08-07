/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6322 = {
  "name": "Aura Mainnet",
  "shortName": "aura",
  "chain": "Aura",
  "icon": "aura",
  "rpc": [
    "https://jsonrpc.aura.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Aura",
    "symbol": "AURA",
    "decimals": 18
  },
  "infoURL": "https://aura.network",
  "chainId": 6322,
  "networkId": 6322,
  "slip44": 1,
  "explorers": [
    {
      "name": "Aurascan Explorer",
      "url": "https://aurascan.io",
      "standard": "none"
    }
  ]
} satisfies Chain