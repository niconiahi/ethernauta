/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_38 = {
  "name": "Valorbit",
  "shortName": "val",
  "chain": "VAL",
  "rpc": [
    "https://rpc.valorbit.com/v2"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Valorbit",
    "symbol": "VAL",
    "decimals": 18
  },
  "infoURL": "https://valorbit.com",
  "chainId": 38,
  "networkId": 38,
  "slip44": 538
} satisfies Chain