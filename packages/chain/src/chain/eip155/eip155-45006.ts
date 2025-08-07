/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_45006 = {
  "name": "Juneo USD1-Chain",
  "shortName": "USD1",
  "chain": "Juneo USD1-Chain",
  "icon": "juneo-usd1",
  "rpc": [
    "https://rpc.juneo-mainnet.network/ext/bc/USD1/rpc"
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
    "name": "USD1",
    "symbol": "USD1",
    "decimals": 18
  },
  "infoURL": "https://juneo.com/",
  "chainId": 45006,
  "networkId": 45006,
  "explorers": [
    {
      "name": "Juneo Scan",
      "url": "https://juneoscan.io/chain/4",
      "standard": "none"
    }
  ]
} satisfies Chain