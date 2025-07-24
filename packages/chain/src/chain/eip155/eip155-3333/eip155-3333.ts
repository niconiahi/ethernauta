/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3333 = {
  "name": "Web3Q Testnet",
  "shortName": "w3q-t",
  "chain": "Web3Q",
  "rpc": [
    "https://testnet.web3q.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Q",
    "symbol": "W3Q",
    "decimals": 18
  },
  "infoURL": "https://testnet.web3q.io/home.w3q/",
  "chainId": 3333,
  "networkId": 3333,
  "slip44": 1,
  "explorers": [
    {
      "name": "w3q-testnet",
      "url": "https://explorer.testnet.web3q.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain