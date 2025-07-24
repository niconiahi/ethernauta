/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_11110 = {
  "name": "Astra",
  "shortName": "astra",
  "chain": "Astra",
  "icon": "astra",
  "rpc": [
    "https://rpc.astranaut.io",
    "https://rpc1.astranaut.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Astra",
    "symbol": "ASA",
    "decimals": 18
  },
  "infoURL": "https://astranaut.io",
  "chainId": 11110,
  "networkId": 11110,
  "explorers": [
    {
      "name": "Astra EVM Explorer (Blockscout)",
      "url": "https://explorer.astranaut.io",
      "standard": "none"
    },
    {
      "name": "Astra PingPub Explorer",
      "url": "https://ping.astranaut.io/astra",
      "standard": "none"
    }
  ]
} satisfies Chain