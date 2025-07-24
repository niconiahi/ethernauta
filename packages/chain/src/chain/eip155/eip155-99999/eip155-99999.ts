/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_99999 = {
  "name": "UB Smart Chain",
  "shortName": "usc",
  "chain": "USC",
  "rpc": [
    "https://rpc.uschain.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "infoURL": "https://www.ubchain.site/",
  "chainId": 99999,
  "networkId": 99999
} satisfies Chain