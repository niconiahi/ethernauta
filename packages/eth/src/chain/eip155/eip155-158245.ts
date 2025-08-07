/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_158245 = {
  "name": "CryptoX",
  "shortName": "cryptox",
  "chain": "XCOIN",
  "rpc": [
    "https://rpc-xcoin.cryptoxnetwork.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "XCOIN",
    "symbol": "XCOIN",
    "decimals": 18
  },
  "infoURL": "https://cryptoxnetwork.io",
  "chainId": 158245,
  "networkId": 158245,
  "explorers": [
    {
      "name": "CryptoX explorer",
      "url": "https://cryptoxscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain