/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3109 = {
  "name": "SatoshiVM Alpha Mainnet",
  "shortName": "SAVM",
  "chain": "SatoshiVM",
  "icon": "satoshivm",
  "rpc": [
    "https://alpha-rpc-node-http.svmscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://www.satoshivm.io/",
  "chainId": 3109,
  "networkId": 3109
} satisfies Chain