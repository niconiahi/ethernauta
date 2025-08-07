/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_42096 = {
  "name": "Heurist Testnet",
  "shortName": "HEU",
  "chain": "HEU",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Heurist",
    "symbol": "HEU",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 42096,
  "networkId": 42096,
  "slip44": 1,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": []
  },
  "status": "active"
} satisfies Chain