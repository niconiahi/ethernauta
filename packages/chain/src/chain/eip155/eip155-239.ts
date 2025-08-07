/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_239 = {
  "name": "TAC Mainnet",
  "shortName": "tacchain_239-1",
  "title": "TAC Mainnet",
  "chain": "TAC",
  "icon": "tac",
  "rpc": [
    "https://rpc.tac.build",
    "https://rpc.ankr.com/tac",
    "https://ws.rpc.tac.build"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TAC",
    "symbol": "TAC",
    "decimals": 18
  },
  "infoURL": "https://tac.build/",
  "chainId": 239,
  "networkId": 239,
  "slip44": 60,
  "explorers": [
    {
      "name": "TAC Explorer",
      "url": "https://explorer.tac.build",
      "standard": "EIP3091"
    },
    {
      "name": "Blockscout",
      "url": "https://tac.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain