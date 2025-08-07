/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1313161567 = {
  "name": "Turbo",
  "shortName": "turbo",
  "chain": "NEAR",
  "icon": "turbo",
  "rpc": [
    "https://rpc-0x4e45415f.aurora-cloud.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Turbo",
    "symbol": "TURBO",
    "decimals": 18
  },
  "infoURL": "https://turbotoken.io",
  "chainId": 1313161567,
  "networkId": 1313161567,
  "explorers": [
    {
      "name": "Turbo explorer",
      "url": "https://explorer.turbo.aurora.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain