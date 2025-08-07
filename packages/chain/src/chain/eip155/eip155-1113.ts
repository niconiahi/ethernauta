/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1113 = {
  "name": "B2 Hub Testnet",
  "shortName": "B2Hub-testnet",
  "chain": "BSQ",
  "icon": "bsquare",
  "rpc": [
    "https://testnet-hub-rpc.bsquared.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BSquared Token",
    "symbol": "B2",
    "decimals": 18
  },
  "infoURL": "https://www.bsquared.network",
  "chainId": 1113,
  "networkId": 1113,
  "explorers": [
    {
      "name": "B2 Hub Habitat Testnet Explorer",
      "url": "https://testnet-hub-explorer.bsquared.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain