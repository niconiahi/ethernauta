/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1072 = {
  "name": "ShimmerEVM Testnet Deprecated 1072",
  "shortName": "shimmerevm-testnet-deprecated-1072",
  "title": "ShimmerEVM Testnet Deprecated 1072",
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
    "decimals": 6
  },
  "infoURL": "https://shimmer.network",
  "chainId": 1072,
  "networkId": 1072,
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