/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1987 = {
  "name": "EtherGem",
  "shortName": "egem",
  "chain": "EGEM",
  "rpc": [
    "https://jsonrpc.egem.io/custom"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EtherGem Ether",
    "symbol": "EGEM",
    "decimals": 18
  },
  "infoURL": "https://egem.io",
  "chainId": 1987,
  "networkId": 1987,
  "slip44": 1987
} satisfies Chain