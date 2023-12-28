/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_35 = {
  "name": "TBWG Chain",
  "shortName": "tbwg",
  "chain": "TBWG",
  "rpc": [
    "https://rpc.tbwg.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TBWG Ether",
    "symbol": "TBG",
    "decimals": 18
  },
  "infoURL": "https://tbwg.io",
  "chainId": 35,
  "networkId": 35
} satisfies Chain