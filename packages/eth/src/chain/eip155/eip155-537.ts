/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_537 = {
  "name": "OpTrust Mainnet",
  "shortName": "optrust",
  "chain": "OpTrust",
  "icon": "optrust",
  "rpc": [
    "https://rpc.optrust.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BSC",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://optrust.io",
  "chainId": 537,
  "networkId": 537,
  "explorers": [
    {
      "name": "OpTrust explorer",
      "url": "https://scan.optrust.io",
      "standard": "none"
    }
  ]
} satisfies Chain