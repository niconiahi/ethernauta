/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2137 = {
  "name": "BigShortBets",
  "shortName": "bigsb",
  "chain": "BIGSB",
  "rpc": [
    "https://market.bigsb.io",
    "wss://market.bigsb.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://bigshortbets.com/",
  "chainId": 2137,
  "networkId": 2137,
  "explorers": []
} satisfies Chain