/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1073 = {
  "name": "ShimmerEVM Testnet",
  "shortName": "shimmerevm-testnet",
  "title": "ShimmerEVM Testnet",
  "chain": "ShimmerEVM",
  "icon": "shimmerevm",
  "rpc": [
    "https://json-rpc.evm.testnet.shimmer.network"
  ],
  "faucets": [
    "https://evm-toolkit.evm.testnet.shimmer.network",
    "https://evm-faucet.testnet.shimmer.network"
  ],
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 6
  },
  "infoURL": "https://shimmer.network",
  "chainId": 1073,
  "networkId": 1073,
  "slip44": 1,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.testnet.shimmer.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain