/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_38401 = {
  "name": "ConnectorManager Robin",
  "shortName": "ttrpg",
  "chain": "Rangers",
  "icon": "rangers",
  "rpc": [
    "https://robin-cm.rangersprotocol.com/api/jsonrpc"
  ],
  "faucets": [
    "https://robin-faucet.rangersprotocol.com"
  ],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "ttRPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "chainId": 38401,
  "networkId": 38401,
  "explorers": [
    {
      "name": "rangersscan-robin",
      "url": "https://robin-rangersscan.rangersprotocol.com",
      "standard": "none"
    }
  ]
} satisfies Chain