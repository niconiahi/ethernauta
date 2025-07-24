/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2025 = {
  "name": "Rangers Protocol Mainnet",
  "shortName": "rpg",
  "chain": "Rangers",
  "icon": "rangers",
  "rpc": [
    "https://mainnet.rangersprotocol.com/api/jsonrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "RPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "chainId": 2025,
  "networkId": 2025,
  "slip44": 1008,
  "explorers": [
    {
      "name": "rangersscan",
      "url": "https://scan.rangersprotocol.com",
      "standard": "none"
    }
  ]
} satisfies Chain