/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1392 = {
  "name": "Joseon Mainnet",
  "shortName": "mun",
  "chain": "Joseon",
  "icon": "joseon",
  "rpc": [
    "https://rpc.modchain.net/blockchain.joseon.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Joseon Mun",
    "symbol": "JSM",
    "decimals": 18
  },
  "infoURL": "https://www.joseon.com/",
  "chainId": 1392,
  "networkId": 1392,
  "explorers": [
    {
      "name": "BlockExplorer",
      "url": "https://www.blockexplorer.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain