/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_33385 = {
  "name": "Zilliqa EVM Devnet",
  "shortName": "zil-devnet",
  "chain": "ZIL",
  "icon": "zilliqa",
  "rpc": [
    "https://api.devnet.zilliqa.com/"
  ],
  "faucets": [
    "https://faucet.devnet.zilliqa.com/"
  ],
  "nativeCurrency": {
    "name": "Zilliqa",
    "symbol": "ZIL",
    "decimals": 18
  },
  "infoURL": "https://www.zilliqa.com/",
  "chainId": 33385,
  "networkId": 33385,
  "explorers": [
    {
      "name": "Zilliqa EVM Devnet Explorer",
      "url": "https://otterscan.devnet.zilliqa.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain