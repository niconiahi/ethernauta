/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3011 = {
  "name": "PLAYA3ULL GAMES",
  "shortName": "3ULL",
  "chain": "3ULL",
  "icon": "playa3ull",
  "rpc": [
    "https://api.mainnet.playa3ull.games"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "3ULL",
    "symbol": "3ULL",
    "decimals": 18
  },
  "infoURL": "https://playa3ull.games",
  "chainId": 3011,
  "networkId": 3011,
  "explorers": [
    {
      "name": "PLAYA3ULL GAMES Explorer",
      "url": "https://3011.routescan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain