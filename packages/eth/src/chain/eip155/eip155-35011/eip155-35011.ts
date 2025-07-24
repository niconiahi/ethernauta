/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_35011 = {
  "name": "J2O Taro",
  "shortName": "j2o",
  "chain": "TARO",
  "rpc": [
    "https://rpc.j2o.io"
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
    "name": "TARO Coin",
    "symbol": "taro",
    "decimals": 18
  },
  "infoURL": "https://j2o.io",
  "chainId": 35011,
  "networkId": 35011,
  "explorers": [
    {
      "name": "J2O Taro Explorer",
      "url": "https://exp.j2o.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain