/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_45003 = {
  "name": "Juneo JUNE-Chain",
  "shortName": "JUNE",
  "chain": "Juneo JUNE-Chain",
  "icon": "juneomainnet",
  "rpc": [
    "https://rpc.juneo-mainnet.network/ext/bc/JUNE/rpc"
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
    "name": "JUNE",
    "symbol": "JUNE",
    "decimals": 18
  },
  "infoURL": "https://juneo.com/",
  "chainId": 45003,
  "networkId": 45003,
  "explorers": [
    {
      "name": "Juneo Scan",
      "url": "https://juneoscan.io/chain/2",
      "standard": "none"
    }
  ]
} satisfies Chain