/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_23451 = {
  "name": "DreyerX Mainnet",
  "shortName": "dreyerx",
  "chain": "DreyerX",
  "icon": "dreyerx",
  "rpc": [
    "https://rpc.dreyerx.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DreyerX",
    "symbol": "DRX",
    "decimals": 18
  },
  "infoURL": "https://dreyerx.com",
  "chainId": 23451,
  "networkId": 23451,
  "explorers": [
    {
      "name": "drxscan",
      "url": "https://scan.dreyerx.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain