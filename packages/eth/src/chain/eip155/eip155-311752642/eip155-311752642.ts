/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_311752642 = {
  "name": "OneLedger Mainnet",
  "shortName": "oneledger",
  "chain": "OLT",
  "icon": "oneledger",
  "rpc": [
    "https://mainnet-rpc.oneledger.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OLT",
    "symbol": "OLT",
    "decimals": 18
  },
  "infoURL": "https://oneledger.io",
  "chainId": 311752642,
  "networkId": 311752642,
  "explorers": [
    {
      "name": "OneLedger Block Explorer",
      "url": "https://mainnet-explorer.oneledger.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain