/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_252525 = {
  "name": "CELESTIUM Network Testnet",
  "shortName": "tclt",
  "chain": "CELESTIUM",
  "icon": "celestium",
  "rpc": [
    "https://rpc-private-testnet.celestium.network"
  ],
  "faucets": [
    "https://faucet.celestium.network"
  ],
  "nativeCurrency": {
    "name": "CLT",
    "symbol": "tCLT",
    "decimals": 18
  },
  "infoURL": "https://celestium.network",
  "chainId": 252525,
  "networkId": 252525,
  "slip44": 1,
  "explorers": [
    {
      "name": "CELESTIUM Testnet Explorer",
      "url": "https://testnet.celestium.network",
      "standard": "none"
    }
  ]
} satisfies Chain