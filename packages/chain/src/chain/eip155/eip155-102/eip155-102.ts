/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_102 = {
  "name": "Web3Games Testnet",
  "shortName": "tw3g",
  "chain": "Web3Games",
  "icon": "web3games",
  "rpc": [
    "https://testnet-rpc-0.web3games.org/evm",
    "https://testnet-rpc-1.web3games.org/evm",
    "https://testnet-rpc-2.web3games.org/evm"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Games",
    "symbol": "W3G",
    "decimals": 18
  },
  "infoURL": "https://web3games.org/",
  "chainId": 102,
  "networkId": 102,
  "slip44": 1
} satisfies Chain