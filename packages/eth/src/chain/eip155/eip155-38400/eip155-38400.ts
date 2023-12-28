/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_38400 = {
  "name": "ConnectorManager",
  "shortName": "cmrpg",
  "chain": "Rangers",
  "icon": "rangers",
  "rpc": [
    "https://cm.rangersprotocol.com/api/jsonrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "cmRPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "chainId": 38400,
  "networkId": 38400,
  "explorers": [
    {
      "name": "rangersscan",
      "url": "https://scan.rangersprotocol.com",
      "standard": "none"
    }
  ]
} satisfies Chain