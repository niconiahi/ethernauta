/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_986 = {
  "name": "LAGOM Mainnet",
  "shortName": "Lagom-Chain",
  "chain": "LAGOM Mainnet",
  "rpc": [
    "https://rpc1.lagom.mainnet.zeeve.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LAGO",
    "symbol": "LAGO",
    "decimals": 18
  },
  "infoURL": "https://lagomchain.com",
  "chainId": 986,
  "networkId": 986,
  "explorers": [
    {
      "name": "tracehawk",
      "url": "https://Explorer.lagomchain.com",
      "standard": "none"
    }
  ]
} satisfies Chain