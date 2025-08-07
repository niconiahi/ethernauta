/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_397 = {
  "name": "NEAR Protocol",
  "shortName": "near",
  "chain": "NEAR",
  "icon": "near",
  "rpc": [
    "https://eth-rpc.mainnet.near.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NEAR",
    "symbol": "NEAR",
    "decimals": 18
  },
  "infoURL": "https://near.org",
  "chainId": 397,
  "networkId": 397,
  "explorers": [
    {
      "name": "NEAR Explorer",
      "url": "https://eth-explorer.near.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain