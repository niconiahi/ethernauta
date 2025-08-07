/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_33103 = {
  "name": "Zilliqa 2 EVM proto-testnet",
  "shortName": "zq2-proto-testnet",
  "chain": "ZIL",
  "icon": "zilliqa",
  "rpc": [
    "https://api.zq2-prototestnet.zilliqa.com"
  ],
  "faucets": [
    "https://faucet.zq2-prototestnet.zilliqa.com"
  ],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "chainId": 33103,
  "networkId": 33103,
  "explorers": [
    {
      "name": "Zilliqa 2 EVM proto-testnet explorer",
      "url": "https://explorer.zq2-prototestnet.zilliqa.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain