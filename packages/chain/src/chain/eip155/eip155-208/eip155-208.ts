/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_208 = {
  "name": "Structx Mainnet",
  "shortName": "utx",
  "chain": "utx",
  "rpc": [
    "https://mainnet.structx.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Notes",
    "symbol": "utx",
    "decimals": 18
  },
  "infoURL": "https://structx.io",
  "chainId": 208,
  "networkId": 208
} satisfies Chain