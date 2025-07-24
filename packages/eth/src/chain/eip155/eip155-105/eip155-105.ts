/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_105 = {
  "name": "Web3Games Devnet",
  "shortName": "dw3g",
  "chain": "Web3Games",
  "icon": "web3games",
  "rpc": [
    "https://devnet.web3games.org/evm"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Games",
    "symbol": "W3G",
    "decimals": 18
  },
  "infoURL": "https://web3games.org/",
  "chainId": 105,
  "networkId": 105,
  "explorers": [
    {
      "name": "Web3Games Explorer",
      "url": "https://explorer-devnet.web3games.org",
      "standard": "none"
    }
  ]
} satisfies Chain