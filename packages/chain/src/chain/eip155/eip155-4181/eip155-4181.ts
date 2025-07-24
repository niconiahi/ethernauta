/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4181 = {
  "name": "PHI Network V1",
  "shortName": "PHIv1",
  "chain": "PHI V1",
  "icon": "phi",
  "rpc": [
    "https://rpc1.phi.network",
    "https://rpc2.phi.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PHI",
    "symbol": "Φ",
    "decimals": 18
  },
  "infoURL": "https://phi.network",
  "chainId": 4181,
  "networkId": 4181,
  "explorers": [
    {
      "name": "PHI Explorer",
      "url": "https://explorer.phi.network",
      "standard": "none"
    }
  ]
} satisfies Chain