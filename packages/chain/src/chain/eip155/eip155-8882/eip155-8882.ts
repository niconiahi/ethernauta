/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8882 = {
  "name": "Opal testnet by Unique",
  "shortName": "opl",
  "chain": "UNQ",
  "icon": "opal",
  "rpc": [
    "https://rpc-opal.unique.network",
    "https://us-rpc-opal.unique.network",
    "https://eu-rpc-opal.unique.network",
    "https://asia-rpc-opal.unique.network"
  ],
  "faucets": [
    "https://t.me/unique2faucet_opal_bot"
  ],
  "nativeCurrency": {
    "name": "Opal",
    "symbol": "UNQ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "chainId": 8882,
  "networkId": 8882,
  "slip44": 1,
  "explorers": [
    {
      "name": "Unique Scan / Opal",
      "url": "https://uniquescan.io/opal",
      "standard": "none"
    }
  ]
} satisfies Chain