/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_161201 = {
  "name": "OpenLedger Testnet",
  "shortName": "openledgertest",
  "chain": "OpenLedger Testnet",
  "icon": "openledger",
  "rpc": [
    "https://rpctn.openledger.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Openledger",
    "symbol": "OPN",
    "decimals": 18
  },
  "infoURL": "https://www.openledger.xyz",
  "chainId": 161201,
  "networkId": 161201,
  "explorers": [
    {
      "name": "OpenLedger Testnet Explorer",
      "url": "https://scantn.openledger.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain