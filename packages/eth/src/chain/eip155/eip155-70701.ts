/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_70701 = {
  "name": "Proof of Play - Boss",
  "shortName": "pop-boss",
  "chain": "ETH",
  "icon": "pop-boss",
  "rpc": [
    "https://rpc.boss.proofofplay.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://proofofplay.com",
  "chainId": 70701,
  "networkId": 70701,
  "explorers": [
    {
      "name": "Proof of Play Boss Explorer",
      "url": "https://explorer.boss.proofofplay.com",
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
        "url": "https://relay.link/bridge/boss/"
      }
    ]
  }
} satisfies Chain