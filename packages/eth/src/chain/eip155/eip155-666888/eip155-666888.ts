/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_666888 = {
  "name": "Hela Official Runtime Testnet",
  "shortName": "hela-testnet",
  "chain": "Hela",
  "icon": "hela",
  "rpc": [
    "https://testnet-rpc.helachain.com"
  ],
  "faucets": [
    "https://testnet-faucet.helachain.com"
  ],
  "nativeCurrency": {
    "name": "Hela HLUSD",
    "symbol": "HLUSD",
    "decimals": 18
  },
  "infoURL": "https://helalabs.com",
  "chainId": 666888,
  "networkId": 666888,
  "slip44": 1,
  "explorers": [
    {
      "name": "Hela Official Runtime Testnet Explorer",
      "url": "https://testnet-blockexplorer.helachain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain