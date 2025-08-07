/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_45011 = {
  "name": "Juneo EUR1-Chain",
  "shortName": "EUR1",
  "chain": "Juneo EUR1-Chain",
  "icon": "juneo-eur1",
  "rpc": [
    "https://rpc.juneo-mainnet.network/ext/bc/EUR1/rpc"
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
    "name": "EUR1",
    "symbol": "EUR1",
    "decimals": 18
  },
  "infoURL": "https://juneo.com/",
  "chainId": 45011,
  "networkId": 45011,
  "explorers": [
    {
      "name": "Juneo Scan",
      "url": "https://juneoscan.io/chain/6",
      "standard": "none"
    }
  ]
} satisfies Chain