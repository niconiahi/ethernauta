/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8668 = {
  "name": "Hela Official Runtime Mainnet",
  "shortName": "hela",
  "chain": "Hela",
  "icon": "hela",
  "rpc": [
    "https://mainnet-rpc.helachain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Hela HLUSD",
    "symbol": "HLUSD",
    "decimals": 18
  },
  "infoURL": "https://helalabs.com",
  "chainId": 8668,
  "networkId": 8668,
  "explorers": [
    {
      "name": "Hela Official Runtime Mainnet Explorer",
      "url": "https://mainnet-blockexplorer.helachain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain