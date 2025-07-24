/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_148 = {
  "name": "ShimmerEVM Mainnet",
  "shortName": "shimmerevm-mainnet",
  "title": "ShimmerEVM Mainnet",
  "chain": "ShimmerEVM",
  "icon": "shimmerevm",
  "rpc": [
    "https://json-rpc.evm.shimmer.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 18
  },
  "infoURL": "https://shimmer.network",
  "chainId": 148,
  "networkId": 148,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.shimmer.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain