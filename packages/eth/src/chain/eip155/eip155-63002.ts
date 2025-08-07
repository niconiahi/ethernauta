/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_63002 = {
  "name": "eSync Network Testnet",
  "shortName": "esync-testnet",
  "title": "eSync Network Testnet",
  "chain": "ECS",
  "icon": "esync",
  "rpc": [
    "https://rpc.tst.esync.network"
  ],
  "faucets": [
    "https://faucet.tst.ecredits.com"
  ],
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "infoURL": "https://esync.network",
  "chainId": 63002,
  "networkId": 63002,
  "slip44": 1,
  "explorers": [
    {
      "name": "eSync Network Testnet Explorer",
      "url": "https://explorer.tst.esync.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain