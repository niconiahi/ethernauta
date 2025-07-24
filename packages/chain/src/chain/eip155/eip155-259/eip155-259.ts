/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_259 = {
  "name": "Neonlink Mainnet",
  "shortName": "neon",
  "chain": "Neonlink",
  "icon": "neonlink",
  "rpc": [
    "https://mainnet.neonlink.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Neonlink Native Token",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neonlink.io",
  "chainId": 259,
  "networkId": 259,
  "explorers": [
    {
      "name": "Neon Blockchain Explorer",
      "url": "https://scan.neonlink.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain