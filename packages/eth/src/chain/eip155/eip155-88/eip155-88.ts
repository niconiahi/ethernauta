/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_88 = {
  "name": "TomoChain",
  "shortName": "tomo",
  "chain": "TOMO",
  "rpc": [
    "https://rpc.tomochain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "infoURL": "https://tomochain.com",
  "chainId": 88,
  "networkId": 88,
  "slip44": 889
} satisfies Chain