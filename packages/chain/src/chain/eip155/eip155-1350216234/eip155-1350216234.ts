/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1350216234 = {
  "name": "SKALE Titan Hub",
  "shortName": "titan-mainnet",
  "chain": "parallel-stormy-spica",
  "icon": "titan",
  "rpc": [
    "https://mainnet.skalenodes.com/v1/parallel-stormy-spica",
    "wss://mainnet.skalenodes.com/v1/ws/parallel-stormy-spica"
  ],
  "faucets": [
    "https://sfuel.skale.network/"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 1350216234,
  "networkId": 1350216234,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://parallel-stormy-spica.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain