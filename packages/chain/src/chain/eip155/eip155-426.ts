/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_426 = {
  "name": "The Widows Mite",
  "shortName": "mite",
  "chain": "MITE",
  "icon": "mite",
  "rpc": [
    "https://rpc.twmcrypto.com/"
  ],
  "faucets": [
    "https://faucet.twmcrypto.com/"
  ],
  "nativeCurrency": {
    "name": "The Widows Mite",
    "symbol": "MITE",
    "decimals": 8
  },
  "infoURL": "https://twmcrypto.com/",
  "chainId": 426,
  "networkId": 426,
  "explorers": [
    {
      "name": "The Widows Mite Explorer",
      "url": "https://scan.twmcrypto.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain