/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_33 = {
  "name": "GoodData Mainnet",
  "shortName": "GooD",
  "chain": "GooD",
  "rpc": [
    "https://rpc.goodata.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GoodData Mainnet Ether",
    "symbol": "GooD",
    "decimals": 18
  },
  "infoURL": "https://www.goodata.org",
  "chainId": 33,
  "networkId": 33
} satisfies Chain