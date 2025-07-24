/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8883 = {
  "name": "Sapphire by Unique",
  "shortName": "sph",
  "chain": "UNQ",
  "icon": "sapphire",
  "rpc": [
    "https://rpc-sapphire.unique.network",
    "https://us-rpc-sapphire.unique.network",
    "https://eu-rpc-sapphire.unique.network",
    "https://asia-rpc-sapphire.unique.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quartz",
    "symbol": "QTZ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "chainId": 8883,
  "networkId": 8883,
  "explorers": [
    {
      "name": "Unique Scan / Sapphire",
      "url": "https://uniquescan.io/sapphire",
      "standard": "none"
    }
  ]
} satisfies Chain