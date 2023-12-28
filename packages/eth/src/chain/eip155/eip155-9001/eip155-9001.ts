/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9001 = {
  "name": "Evmos",
  "shortName": "evmos",
  "chain": "Evmos",
  "icon": "evmos",
  "rpc": [
    "https://evmos.lava.build",
    "wss://evmos.lava.build/websocket",
    "https://evmos-evm.publicnode.com",
    "wss://evmos-evm.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Evmos",
    "symbol": "EVMOS",
    "decimals": 18
  },
  "infoURL": "https://evmos.org",
  "chainId": 9001,
  "networkId": 9001,
  "explorers": [
    {
      "name": "Evmos Explorer (Escan)",
      "url": "https://escan.live",
      "standard": "none"
    }
  ]
} satisfies Chain