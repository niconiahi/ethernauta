/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2013 = {
  "name": "Panarchy",
  "shortName": "panarchy",
  "chain": "Panarchy",
  "rpc": [
    "https://polytopia.org:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GAS",
    "symbol": "GAS",
    "decimals": 18
  },
  "infoURL": "https://polytopia.org/",
  "chainId": 2013,
  "networkId": 1
} satisfies Chain