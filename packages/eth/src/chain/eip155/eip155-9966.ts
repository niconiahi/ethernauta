/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9966 = {
  "name": "UXER TESTNET NETWORK",
  "shortName": "uxer",
  "chain": "UXER",
  "icon": "uxer",
  "rpc": [
    "https://dev-testnet.uxer.network",
    "https://data-cloud-testnet.uxer.network"
  ],
  "faucets": [
    "https://faucet.uxer.network"
  ],
  "nativeCurrency": {
    "name": "UXER",
    "symbol": "tUXER",
    "decimals": 18
  },
  "infoURL": "https://uxer.network",
  "chainId": 9966,
  "networkId": 9966,
  "slip44": 1,
  "explorers": [
    {
      "name": "UXER TESTNET EXPLORER",
      "url": "https://testnet.uxer.network",
      "standard": "none"
    }
  ]
} satisfies Chain