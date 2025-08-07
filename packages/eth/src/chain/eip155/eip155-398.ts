/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_398 = {
  "name": "NEAR Protocol Testnet",
  "shortName": "near-testnet",
  "chain": "NEAR",
  "icon": "near",
  "rpc": [
    "https://eth-rpc.testnet.near.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NEAR",
    "symbol": "NEAR",
    "decimals": 18
  },
  "infoURL": "https://near.org",
  "chainId": 398,
  "networkId": 398,
  "explorers": [
    {
      "name": "NEAR Explorer",
      "url": "https://eth-explorer-testnet.near.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain