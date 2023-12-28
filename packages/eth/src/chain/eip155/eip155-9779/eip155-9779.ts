/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9779 = {
  "name": "PepeNetwork Mainnet",
  "shortName": "pn",
  "chain": "PepeNetwork",
  "icon": "pepenetwork",
  "rpc": [
    "https://rpc-mainnet.pepenetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "WPEPE",
    "decimals": 18
  },
  "infoURL": "https://pepenetwork.io",
  "chainId": 9779,
  "networkId": 9779,
  "explorers": [
    {
      "name": "Pepe Explorer",
      "url": "https://explorer.pepenetwork.io",
      "standard": "none"
    }
  ]
} satisfies Chain