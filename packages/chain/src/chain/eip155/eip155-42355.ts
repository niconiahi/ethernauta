/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_42355 = {
  "name": "GoldXChain Mainnet",
  "shortName": "goldx",
  "chain": "GoldX",
  "rpc": [
    "https://mainnet-rpc.goldxchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GoldX",
    "symbol": "GOLDX",
    "decimals": 18
  },
  "infoURL": "https://goldxchain.io",
  "chainId": 42355,
  "networkId": 42355,
  "explorers": [
    {
      "name": "GoldXChain Explorer",
      "url": "https://explorer.goldxchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain