/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3334 = {
  "name": "Web3Q Galileo",
  "shortName": "w3q-g",
  "chain": "Web3Q",
  "rpc": [
    "https://galileo.web3q.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://galileo.web3q.io/home.w3q/",
  "chainId": 3334,
  "networkId": 3334,
  "explorers": [
    {
      "name": "w3q-galileo",
      "url": "https://explorer.galileo.web3q.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain