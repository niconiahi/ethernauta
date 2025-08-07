/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_14333 = {
  "name": "Vitruveo Testnet",
  "shortName": "vitruveo-test",
  "title": "Vitruveo is a blockchain for Creators",
  "chain": "Vitruveo",
  "icon": "vitruveo",
  "rpc": [
    "https://test-rpc.vitruveo.xyz"
  ],
  "faucets": [
    "https://faucet.vitruveo.xyz"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Vitruveo Test Coin",
    "symbol": "tVTRU",
    "decimals": 18
  },
  "infoURL": "https://www.vitruveo.xyz",
  "chainId": 14333,
  "networkId": 14333,
  "explorers": [
    {
      "name": "Vitruveo Testnet Explorer",
      "url": "https://test-explorer.vitruveo.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain