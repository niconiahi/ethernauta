/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2391 = {
  "name": "TAC Saint Petersburg",
  "shortName": "tacchain_2391-1",
  "title": "TAC Testnet SPB",
  "chain": "TAC",
  "icon": "tactestnet",
  "rpc": [
    "https://spb.rpc.tac.build",
    "https://rpc.ankr.com/tac_spb",
    "https://spb-ws.rpc.tac.build"
  ],
  "faucets": [
    "https://spb.faucet.tac.build/"
  ],
  "nativeCurrency": {
    "name": "TAC",
    "symbol": "TAC",
    "decimals": 18
  },
  "infoURL": "https://tac.build/",
  "chainId": 2391,
  "networkId": 2391,
  "slip44": 60,
  "explorers": [
    {
      "name": "TAC SPB Explorer",
      "url": "https://spb.explorer.tac.build",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain