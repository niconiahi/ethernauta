/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_26888 = {
  "name": "AB Core Testnet",
  "shortName": "tABCore",
  "chain": "ETH",
  "rpc": [
    "https://rpc.core.testnet.ab.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AB",
    "symbol": "AB",
    "decimals": 18
  },
  "infoURL": "https://ab.org",
  "chainId": 26888,
  "networkId": 26888,
  "explorers": [
    {
      "name": "AB Core explorer",
      "url": "https://explorer.core.testnet.ab.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain