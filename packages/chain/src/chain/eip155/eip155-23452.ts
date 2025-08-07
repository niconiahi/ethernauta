/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_23452 = {
  "name": "DreyerX Testnet",
  "shortName": "dreyerx-testnet",
  "chain": "DreyerX",
  "icon": "dreyerx",
  "rpc": [
    "https://testnet-rpc.dreyerx.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DreyerX",
    "symbol": "DRX",
    "decimals": 18
  },
  "infoURL": "https://dreyerx.com",
  "chainId": 23452,
  "networkId": 23452,
  "explorers": [
    {
      "name": "drxscan",
      "url": "https://testnet-scan.dreyerx.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain