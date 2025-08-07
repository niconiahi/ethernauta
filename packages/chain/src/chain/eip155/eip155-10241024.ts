/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10241024 = {
  "name": "AlienX Mainnet",
  "shortName": "AlienX",
  "chain": "AlienX Mainnet",
  "icon": "alienx",
  "rpc": [
    "https://rpc.alienxchain.io/http"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://alienxchain.io/home",
  "chainId": 10241024,
  "networkId": 10241024,
  "explorers": [
    {
      "name": "AlienXChain Explorer",
      "url": "https://explorer.alienxchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain