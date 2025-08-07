/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_22324 = {
  "name": "GoldXChain Testnet",
  "shortName": "goldx-testnet",
  "chain": "GoldXTestnet",
  "rpc": [
    "https://testnet-rpc.goldxchain.io"
  ],
  "faucets": [
    "https://faucet.goldxchain.io"
  ],
  "nativeCurrency": {
    "name": "GoldX",
    "symbol": "GOLDX",
    "decimals": 18
  },
  "infoURL": "https://goldxchain.io",
  "chainId": 22324,
  "networkId": 22324,
  "explorers": [
    {
      "name": "GoldXChain Testnet Explorer",
      "url": "https://testnet-explorer.goldxchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain