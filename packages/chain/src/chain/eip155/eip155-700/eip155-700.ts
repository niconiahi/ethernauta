/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_700 = {
  "name": "Star Social Testnet",
  "shortName": "SNS",
  "chain": "SNS",
  "rpc": [
    "https://avastar.cc/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Social",
    "symbol": "SNS",
    "decimals": 18
  },
  "infoURL": "https://info.avastar.cc",
  "chainId": 700,
  "networkId": 700,
  "slip44": 1,
  "explorers": [
    {
      "name": "starscan",
      "url": "https://avastar.info",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain