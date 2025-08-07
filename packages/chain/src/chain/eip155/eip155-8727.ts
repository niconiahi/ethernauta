/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8727 = {
  "name": "Storagechain Testnet",
  "shortName": "tstor",
  "chain": "Storagechain",
  "icon": "storagechain",
  "rpc": [
    "https://testnet-validator.storagechain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Storagechain",
    "symbol": "STOR",
    "decimals": 18
  },
  "infoURL": "https://storagechain.io/about-us",
  "chainId": 8727,
  "networkId": 8727,
  "explorers": [
    {
      "name": "Storscan",
      "url": "https://explorer-storagechain.invo.zone/?network=StorageChain%20Testnet",
      "standard": "none"
    }
  ]
} satisfies Chain