/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_144 = {
  "name": "PHI Network v2",
  "shortName": "PHI",
  "chain": "PHI",
  "icon": "phi",
  "rpc": [
    "https://connect.phi.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PHI",
    "symbol": "Φ",
    "decimals": 18
  },
  "infoURL": "https://phi.network",
  "chainId": 144,
  "networkId": 144,
  "explorers": [
    {
      "name": "Phiscan",
      "url": "https://phiscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain