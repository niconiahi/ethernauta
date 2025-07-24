/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_333333 = {
  "name": "Nativ3 Testnet",
  "shortName": "N3-Test",
  "chain": "N3-Test",
  "icon": "nativ3",
  "rpc": [
    "https://rpctest.nativ3.network",
    "wss://wstest.nativ3.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USNT",
    "symbol": "USNT",
    "decimals": 18
  },
  "infoURL": "https://nativ3.network",
  "chainId": 333333,
  "networkId": 333333,
  "slip44": 1,
  "explorers": [
    {
      "name": "Nativ3 Test Explorer",
      "url": "https://scantest.nativ3.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-421613",
    "bridges": [
      {
        "url": "https://bridgetest.nativ3.network"
      }
    ]
  }
} satisfies Chain