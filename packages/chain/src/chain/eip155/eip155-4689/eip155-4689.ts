/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4689 = {
  "name": "IoTeX Network Mainnet",
  "shortName": "iotex-mainnet",
  "chain": "iotex.io",
  "rpc": [
    "https://babel-api.mainnet.iotex.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "IoTeX",
    "symbol": "IOTX",
    "decimals": 18
  },
  "infoURL": "https://iotex.io",
  "chainId": 4689,
  "networkId": 4689,
  "explorers": [
    {
      "name": "iotexscan",
      "url": "https://iotexscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain