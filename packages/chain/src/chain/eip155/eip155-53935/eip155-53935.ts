/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_53935 = {
  "name": "DFK Chain",
  "shortName": "DFK",
  "chain": "DFK",
  "icon": "dfk",
  "rpc": [
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Jewel",
    "symbol": "JEWEL",
    "decimals": 18
  },
  "infoURL": "https://defikingdoms.com",
  "chainId": 53935,
  "networkId": 53935,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://explorer.dfkchain.com",
      "standard": "none"
    }
  ]
} satisfies Chain