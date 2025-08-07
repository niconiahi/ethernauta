/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3301 = {
  "name": "Realio",
  "shortName": "realio",
  "chain": "Realio",
  "icon": "realio",
  "rpc": [
    "https://json-rpc.realio.network",
    "https://realio.json-rpc.decentrio.ventures"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Rio",
    "symbol": "RIO",
    "decimals": 18
  },
  "infoURL": "https://www.realio.network",
  "chainId": 3301,
  "networkId": 3301,
  "explorers": [
    {
      "name": "Realio Explorer",
      "url": "https://explorer.realio.network",
      "standard": "none"
    }
  ]
} satisfies Chain