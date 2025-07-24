/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_31337 = {
  "name": "GoChain Testnet",
  "shortName": "got",
  "chain": "GO",
  "rpc": [
    "https://testnet-rpc.gochain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GoChain Coin",
    "symbol": "GO",
    "decimals": 18
  },
  "infoURL": "https://gochain.io",
  "chainId": 31337,
  "networkId": 31337,
  "slip44": 1,
  "explorers": [
    {
      "name": "GoChain Testnet Explorer",
      "url": "https://testnet-explorer.gochain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain