/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2390 = {
  "name": "TAC Turin",
  "shortName": "tacchain_2390-1",
  "title": "TAC Testnet Turin",
  "chain": "TAC",
  "icon": "tactestnet",
  "rpc": [
    "https://turin.rpc.tac.build",
    "https://rpc.ankr.com/tac_turin",
    "https://turin-ws.rpc.tac.build"
  ],
  "faucets": [
    "https://turin.faucet.tac.build/"
  ],
  "nativeCurrency": {
    "name": "TAC",
    "symbol": "TAC",
    "decimals": 18
  },
  "infoURL": "https://tac.build/",
  "chainId": 2390,
  "networkId": 2390,
  "slip44": 60,
  "explorers": [
    {
      "name": "TAC Turin Blockscout",
      "url": "https://turin.explorer.tac.build",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain