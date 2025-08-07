/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_29536 = {
  "name": "KaiChain Testnet",
  "shortName": "tkec",
  "chain": "KaiChain",
  "rpc": [
    "https://testnet-rpc.kaichain.net"
  ],
  "faucets": [
    "https://faucet.kaichain.net"
  ],
  "nativeCurrency": {
    "name": "KaiChain Testnet Native Token",
    "symbol": "KEC",
    "decimals": 18
  },
  "infoURL": "https://kaichain.net",
  "chainId": 29536,
  "networkId": 29536,
  "explorers": [
    {
      "name": "KaiChain Explorer",
      "url": "https://testnet-explorer.kaichain.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain