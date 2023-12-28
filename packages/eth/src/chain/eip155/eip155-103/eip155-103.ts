/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_103 = {
  "name": "Worldland Mainnet",
  "shortName": "WLC",
  "chain": "Worldland",
  "icon": "worldland",
  "rpc": [
    "https://seoul.worldland.foundation"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Worldland",
    "symbol": "WL",
    "decimals": 18
  },
  "infoURL": "https://worldland.foundation",
  "chainId": 103,
  "networkId": 103,
  "explorers": [
    {
      "name": "Worldland Explorer",
      "url": "https://scan.worldland.foundation",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain