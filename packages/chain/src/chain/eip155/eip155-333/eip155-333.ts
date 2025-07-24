/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_333 = {
  "name": "Web3Q Mainnet",
  "shortName": "w3q",
  "chain": "Web3Q",
  "rpc": [
    "https://mainnet.web3q.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://web3q.io/home.w3q/",
  "chainId": 333,
  "networkId": 333,
  "explorers": [
    {
      "name": "w3q-mainnet",
      "url": "https://explorer.mainnet.web3q.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain