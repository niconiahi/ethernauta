/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2481632 = {
  "name": "Recall Testnet",
  "shortName": "trecall",
  "chain": "Recall Testnet",
  "rpc": [
    "https://evm.v013.node-0.testnet.recall.network"
  ],
  "faucets": [
    "faucet.recall.network"
  ],
  "nativeCurrency": {
    "name": "Recall",
    "symbol": "RECALL",
    "decimals": 18
  },
  "infoURL": "https://recall.network",
  "chainId": 2481632,
  "networkId": 2481632,
  "explorers": [
    {
      "name": "Recall testnet explorer",
      "url": "https://explorer.testnet.recall.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain