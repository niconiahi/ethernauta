/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1440 = {
  "name": "Living Assets Mainnet",
  "shortName": "LAS",
  "chain": "LAS",
  "icon": "livingassets",
  "rpc": [
    "https://beta.mainnet.livingassets.io/rpc",
    "https://gamma.mainnet.livingassets.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LAS",
    "symbol": "LAS",
    "decimals": 18
  },
  "infoURL": "https://dev.livingassets.io/",
  "chainId": 1440,
  "networkId": 1440
} satisfies Chain