/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_198 = {
  "name": "Bitchain Mainnet",
  "shortName": "bit",
  "chain": "Bit",
  "rpc": [
    "https://rpc.bitchain.biz/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://www.bitchain.biz/",
  "chainId": 198,
  "networkId": 198,
  "explorers": [
    {
      "name": "Bitchain Scan",
      "url": "https://explorer.bitchain.biz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain