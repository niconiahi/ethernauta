/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_56026 = {
  "name": "Lambda Chain Mainnet",
  "shortName": "lambda",
  "chain": "Lambda Chain",
  "icon": "lambda-chain",
  "rpc": [
    "https://nrpc.lambda.im/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lambda.im",
  "chainId": 56026,
  "networkId": 56026,
  "slip44": 1,
  "explorers": [
    {
      "name": "Lambda Chain Mainnet Explorer",
      "url": "https://scan.lambda.im",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain