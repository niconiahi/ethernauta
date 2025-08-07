/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2026 = {
  "name": "Edgeless Network",
  "shortName": "edgeless",
  "chain": "Edgeless",
  "rpc": [
    "https://rpc.edgeless.network/http"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Edgeless Wrapped Eth",
    "symbol": "EwEth",
    "decimals": 18
  },
  "infoURL": "https://edgeless.network",
  "chainId": 2026,
  "networkId": 2026,
  "explorers": [
    {
      "name": "Edgeless Explorer",
      "url": "https://explorer.edgeless.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain