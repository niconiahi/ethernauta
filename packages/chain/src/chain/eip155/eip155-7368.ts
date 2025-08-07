/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7368 = {
  "name": "Rarimo",
  "shortName": "rarimo",
  "title": "Rarimo Mainnet",
  "chain": "ETH",
  "icon": "rarimo",
  "rpc": [
    "https://l2.rarimo.com",
    "wss://wss.l2.rarimo.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rarimo Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://rarimo.com",
  "chainId": 7368,
  "networkId": 7368,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://scan.rarimo.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://l2bridge.rarimo.com"
      }
    ]
  },
  "status": "active"
} satisfies Chain