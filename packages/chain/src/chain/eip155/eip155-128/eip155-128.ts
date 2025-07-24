/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_128 = {
  "name": "Huobi ECO Chain Mainnet",
  "shortName": "heco",
  "chain": "Heco",
  "rpc": [
    "https://http-mainnet.hecochain.com",
    "wss://ws-mainnet.hecochain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Huobi ECO Chain Native Token",
    "symbol": "HT",
    "decimals": 18
  },
  "infoURL": "https://www.hecochain.com",
  "chainId": 128,
  "networkId": 128,
  "slip44": 1010,
  "explorers": [
    {
      "name": "hecoinfo",
      "url": "https://hecoinfo.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain