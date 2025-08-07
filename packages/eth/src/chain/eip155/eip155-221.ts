/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_221 = {
  "name": "BlockEx Mainnet",
  "shortName": "BlockEx",
  "chain": "BlockEx",
  "rpc": [
    "https://rpc.blockex.biz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BlockEx",
    "symbol": "XBE",
    "decimals": 18
  },
  "infoURL": "https://blockex.biz",
  "chainId": 221,
  "networkId": 221,
  "explorers": [
    {
      "name": "BlockEx Scan",
      "url": "http://explorer.blockex.biz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain