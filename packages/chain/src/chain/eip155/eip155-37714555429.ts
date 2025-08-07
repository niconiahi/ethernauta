/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_37714555429 = {
  "name": "Xai Testnet v2",
  "shortName": "xaitestnet",
  "chain": "XAI Testnet",
  "rpc": [
    "https://testnet-v2.xai-chain.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "sXai",
    "symbol": "sXAI",
    "decimals": 18
  },
  "infoURL": "https://xai.games",
  "chainId": 37714555429,
  "networkId": 37714555429,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer-v2.xai-chain.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain