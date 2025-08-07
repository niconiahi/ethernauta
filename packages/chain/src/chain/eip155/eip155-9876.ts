/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9876 = {
  "name": "BinaryChain Testnet",
  "shortName": "binarytestnet",
  "chain": "BinaryChain",
  "icon": "binary",
  "rpc": [
    "https://rpctestnet.binarychain.org"
  ],
  "faucets": [
    "https://faucet.testnet.binarychain.org"
  ],
  "nativeCurrency": {
    "name": "BINARY",
    "symbol": "BNRY",
    "decimals": 18
  },
  "infoURL": "https://binarychain.org",
  "chainId": 9876,
  "networkId": 9876,
  "explorers": [
    {
      "name": "BinaryChain Testnet Explorer",
      "url": "https://explorer.testnet.binarychain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain