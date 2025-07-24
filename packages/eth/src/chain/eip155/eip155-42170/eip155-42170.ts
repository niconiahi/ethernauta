/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_42170 = {
  "name": "Arbitrum Nova",
  "shortName": "arb-nova",
  "chain": "ETH",
  "rpc": [
    "https://nova.arbitrum.io/rpc",
    "https://arbitrum-nova.publicnode.com",
    "wss://arbitrum-nova.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io",
  "chainId": 42170,
  "networkId": 42170,
  "explorers": [
    {
      "name": "Arbitrum Nova Chain Explorer",
      "url": "https://nova-explorer.arbitrum.io",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://nova.dex.guru",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  }
} satisfies Chain