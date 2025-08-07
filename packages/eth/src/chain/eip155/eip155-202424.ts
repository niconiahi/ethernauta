/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_202424 = {
  "name": "Blockfit",
  "shortName": "Blockfit",
  "chain": "202424",
  "rpc": [
    "https://rpc.blockfitscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BFIT",
    "symbol": "BFIT",
    "decimals": 18
  },
  "infoURL": "https://blockfit.io",
  "chainId": 202424,
  "networkId": 202424,
  "explorers": [
    {
      "name": "Tracehawk",
      "url": "https://blockfitscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain