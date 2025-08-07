/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_560013 = {
  "name": "Rogue Chain",
  "shortName": "rogue",
  "chain": "ROGUE",
  "icon": "rogue",
  "rpc": [
    "https://rpc.roguechain.io/rpc",
    "wss://rpc.roguechain.io/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rogue",
    "symbol": "ROGUE",
    "decimals": 18
  },
  "infoURL": "https://roguechain.io",
  "chainId": 560013,
  "networkId": 560013,
  "explorers": [
    {
      "name": "Roguescan",
      "url": "https://roguescan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  }
} satisfies Chain