/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_98985 = {
  "name": "Superposition Testnet",
  "shortName": "superposition-testnet",
  "title": "Sperposition Testnet",
  "chain": "SPN",
  "rpc": [
    "https://testnet-rpc.superposition.so"
  ],
  "faucets": [
    "https://faucet.superposition.so"
  ],
  "nativeCurrency": {
    "name": "SPN",
    "symbol": "SPN",
    "decimals": 18
  },
  "infoURL": "https://superposition.so",
  "chainId": 98985,
  "networkId": 98985,
  "explorers": [
    {
      "name": "Superposition Explorer",
      "url": "https://testnet-explorer.superposition.so",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain