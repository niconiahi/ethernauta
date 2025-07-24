/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_26863 = {
  "name": "OasisChain Mainnet",
  "shortName": "OAC",
  "chain": "OasisChain",
  "rpc": [
    "https://rpc1.oasischain.io",
    "https://rpc2.oasischain.io",
    "https://rpc3.oasischain.io"
  ],
  "faucets": [
    "http://faucet.oasischain.io"
  ],
  "nativeCurrency": {
    "name": "OAC",
    "symbol": "OAC",
    "decimals": 18
  },
  "infoURL": "https://scan.oasischain.io",
  "chainId": 26863,
  "networkId": 26863,
  "explorers": [
    {
      "name": "OasisChain Explorer",
      "url": "https://scan.oasischain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain