/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_268 = {
  "name": "Neura Devnet",
  "shortName": "dneura",
  "title": "Neura Devnet",
  "chain": "NEURA",
  "icon": "neura",
  "rpc": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Devnet Ankr",
    "symbol": "ANKR",
    "decimals": 18
  },
  "infoURL": "https://www.neuraprotocol.io/",
  "chainId": 268,
  "networkId": 268,
  "slip44": 1,
  "explorers": [],
  "status": "incubating"
} satisfies Chain