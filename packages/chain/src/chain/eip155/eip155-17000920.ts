/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_17000920 = {
  "name": "Lambda Chain Testnet",
  "shortName": "tlambda",
  "chain": "Lambda Chain",
  "icon": "lambda-chain",
  "rpc": [
    "https://testnrpc.lambda.im/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lambda.im",
  "chainId": 17000920,
  "networkId": 17000920,
  "slip44": 1,
  "explorers": [
    {
      "name": "Lambda Chain Testnet Explorer",
      "url": "https://testscan.lambda.im",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain