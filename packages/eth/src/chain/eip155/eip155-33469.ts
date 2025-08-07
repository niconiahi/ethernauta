/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_33469 = {
  "name": "Zilliqa 2 EVM devnet",
  "shortName": "zq2-devnet",
  "chain": "ZIL",
  "icon": "zilliqa",
  "rpc": [
    "https://api.zq2-devnet.zilliqa.com"
  ],
  "faucets": [
    "https://faucet.zq2-devnet.zilliqa.com"
  ],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "chainId": 33469,
  "networkId": 33469,
  "explorers": [
    {
      "name": "Zilliqa-2 EVM Devnet Explorer",
      "url": "https://explorer.zq2-devnet.zilliqa.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain