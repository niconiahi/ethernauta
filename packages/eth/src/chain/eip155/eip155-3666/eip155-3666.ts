/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3666 = {
  "name": "Jouleverse Mainnet",
  "shortName": "jouleverse",
  "chain": "Jouleverse",
  "rpc": [
    "https://rpc.jnsdao.com:8503"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "J",
    "symbol": "J",
    "decimals": 18
  },
  "infoURL": "https://jnsdao.com",
  "chainId": 3666,
  "networkId": 3666,
  "explorers": [
    {
      "name": "jscan",
      "url": "https://jscan.jnsdao.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain