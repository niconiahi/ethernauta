/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_32001 = {
  "name": "W3Gamez Holesky Testnet",
  "shortName": "w3gamez",
  "chain": "ETH",
  "icon": "w3gamez",
  "rpc": [
    "https://rpc-holesky.w3gamez.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "W3Gamez Testnet Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://web3games.com/",
  "chainId": 32001,
  "networkId": 32001,
  "slip44": 1,
  "explorers": [
    {
      "name": "W3Gamez Holesky Explorer",
      "url": "https://w3gamez-holesky.web3games.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain