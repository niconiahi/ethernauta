/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_47805 = {
  "name": "REI Network",
  "shortName": "REI",
  "chain": "REI",
  "rpc": [
    "https://rpc.rei.network",
    "wss://rpc.rei.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "REI",
    "symbol": "REI",
    "decimals": 18
  },
  "infoURL": "https://rei.network/",
  "chainId": 47805,
  "networkId": 47805,
  "explorers": [
    {
      "name": "rei-scan",
      "url": "https://scan.rei.network",
      "standard": "none"
    }
  ]
} satisfies Chain