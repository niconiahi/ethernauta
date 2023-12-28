/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1280 = {
  "name": "HALO Mainnet",
  "shortName": "HO",
  "chain": "HALO",
  "rpc": [
    "https://nodes.halo.land"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HALO",
    "symbol": "HO",
    "decimals": 18
  },
  "infoURL": "https://halo.land/#/",
  "chainId": 1280,
  "networkId": 1280,
  "explorers": [
    {
      "name": "HALOexplorer",
      "url": "https://browser.halo.land",
      "standard": "none"
    }
  ]
} satisfies Chain