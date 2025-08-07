/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_45009 = {
  "name": "Juneo LTC1-Chain",
  "shortName": "LTC1",
  "chain": "Juneo LTC1-Chain",
  "icon": "juneo-ltc1",
  "rpc": [
    "https://rpc.juneo-mainnet.network/ext/bc/LTC1/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "LTC1",
    "symbol": "LTC1",
    "decimals": 18
  },
  "infoURL": "https://juneo.com/",
  "chainId": 45009,
  "networkId": 45009,
  "explorers": [
    {
      "name": "Juneo Scan",
      "url": "https://juneoscan.io/chain/11",
      "standard": "none"
    }
  ]
} satisfies Chain