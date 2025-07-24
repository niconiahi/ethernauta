/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_54 = {
  "name": "Openpiece Mainnet",
  "shortName": "OP",
  "chain": "OPENPIECE",
  "icon": "openpiece",
  "rpc": [
    "https://mainnet.openpiece.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Belly",
    "symbol": "BELLY",
    "decimals": 18
  },
  "infoURL": "https://cryptopiece.online",
  "chainId": 54,
  "networkId": 54,
  "explorers": [
    {
      "name": "Belly Scan",
      "url": "https://bellyscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain