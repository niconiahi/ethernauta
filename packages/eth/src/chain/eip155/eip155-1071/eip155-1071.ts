/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1071 = {
  "name": "ShimmerEVM Testnet Deprecated",
  "shortName": "shimmerevm-testnet-deprecated",
  "title": "ShimmerEVM Testnet Deprecated",
  "chain": "ShimmerEVM",
  "icon": "shimmerevm",
  "rpc": [],
  "faucets": [
    "https://evm-toolkit.evm.testnet.shimmer.network",
    "https://evm-faucet.testnet.shimmer.network"
  ],
  "nativeCurrency": {
    "name": "SMR",
    "symbol": "SMR",
    "decimals": 18
  },
  "infoURL": "https://shimmer.network",
  "chainId": 1071,
  "networkId": 1071,
  "slip44": 1,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.testnet.shimmer.network",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain