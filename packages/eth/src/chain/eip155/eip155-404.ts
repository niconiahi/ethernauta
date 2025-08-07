/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_404 = {
  "name": "Syndr L3",
  "shortName": "syndr-l3",
  "title": "Syndr L3 Rollup",
  "chain": "SYNDR",
  "icon": "syndr",
  "rpc": [
    "https://rpc.syndr.com",
    "wss://rpc.syndr.com/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://syndr.com",
  "chainId": 404,
  "networkId": 404,
  "explorers": [
    {
      "name": "Syndr L3 Explorer",
      "url": "https://explorer.syndr.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://bridge.syndr.com"
      }
    ]
  }
} satisfies Chain