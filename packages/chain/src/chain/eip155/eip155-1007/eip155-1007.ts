/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1007 = {
  "name": "Newton Testnet",
  "shortName": "tnew",
  "chain": "NEW",
  "rpc": [
    "https://rpc1.newchain.newtonproject.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Newton",
    "symbol": "NEW",
    "decimals": 18
  },
  "infoURL": "https://www.newtonproject.org/",
  "chainId": 1007,
  "networkId": 1007,
  "slip44": 1
} satisfies Chain