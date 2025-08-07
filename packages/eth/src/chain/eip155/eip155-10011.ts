/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10011 = {
  "name": "DeepSafe Beta Mainnet",
  "shortName": "DeepSafe",
  "chain": "DeepSafe",
  "icon": "deepsafe",
  "rpc": [
    "https://betamainnet-rpc-node-http.deepsafe.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DeepSafe Native Token",
    "symbol": "DEF",
    "decimals": 18
  },
  "infoURL": "https://deepsafe.network/",
  "chainId": 10011,
  "networkId": 10011
} satisfies Chain