/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_70700 = {
  "name": "Proof of Play - Apex",
  "shortName": "pop-apex",
  "chain": "ETH",
  "rpc": [
    "https://rpc.apex.proofofplay.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://proofofplay.com",
  "chainId": 70700,
  "networkId": 70700,
  "explorers": [
    {
      "name": "Proof of Play Apex Explorer",
      "url": "https://explorer.apex.proofofplay.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      },
      {
        "url": "https://relay.link/bridge/apex/"
      }
    ]
  }
} satisfies Chain