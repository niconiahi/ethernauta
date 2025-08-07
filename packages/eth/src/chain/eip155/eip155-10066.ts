/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10066 = {
  "name": "Chain Opera Testnet",
  "shortName": "chainopera-testnet",
  "chain": "Chain Opera Testnet",
  "rpc": [
    "http://40.78.123.6:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "coai",
    "symbol": "CO",
    "decimals": 18
  },
  "infoURL": "https://chainopera.ai/",
  "chainId": 10066,
  "networkId": 10066
} satisfies Chain