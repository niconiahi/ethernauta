/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_62621 = {
  "name": "MultiVAC Mainnet",
  "shortName": "mtv",
  "chain": "MultiVAC",
  "icon": "multivac",
  "rpc": [
    "https://rpc.mtv.ac",
    "https://rpc-eu.mtv.ac"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MultiVAC",
    "symbol": "MTV",
    "decimals": 18
  },
  "infoURL": "https://mtv.ac",
  "chainId": 62621,
  "networkId": 62621,
  "explorers": [
    {
      "name": "MultiVAC Explorer",
      "url": "https://e.mtv.ac",
      "standard": "none"
    }
  ]
} satisfies Chain