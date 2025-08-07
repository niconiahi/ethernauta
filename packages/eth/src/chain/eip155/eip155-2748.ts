/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2748 = {
  "name": "Nanon",
  "shortName": "Nanon",
  "title": "Nanon Rollup",
  "chain": "ETH",
  "icon": "nanon",
  "rpc": [
    "https://rpc.nanon.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.nanon.network",
  "chainId": 2748,
  "networkId": 2748,
  "slip44": 1,
  "explorers": [
    {
      "name": "Nanon Rollup Explorer",
      "url": "https://explorer.nanon.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.nanon.network"
      }
    ]
  }
} satisfies Chain