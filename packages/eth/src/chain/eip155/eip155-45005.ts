/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_45005 = {
  "name": "Juneo USDT1-Chain",
  "shortName": "USDT1",
  "chain": "Juneo USDT1-Chain",
  "icon": "juneo-usdt1",
  "rpc": [
    "https://rpc.juneo-mainnet.network/ext/bc/USDT1/rpc"
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
    "name": "USDT1",
    "symbol": "USDT1",
    "decimals": 18
  },
  "infoURL": "https://juneo.com/",
  "chainId": 45005,
  "networkId": 45005,
  "explorers": [
    {
      "name": "Juneo Scan",
      "url": "https://juneoscan.io/chain/3",
      "standard": "none"
    }
  ]
} satisfies Chain