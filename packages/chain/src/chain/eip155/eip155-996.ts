/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_996 = {
  "name": "Bifrost Polkadot Mainnet",
  "shortName": "bnc",
  "chain": "Bifrost",
  "icon": "bifrost-polkadot",
  "rpc": [
    "https://hk.p.bifrost-rpc.liebi.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Wrapped ETH",
    "symbol": "WETH",
    "decimals": 18
  },
  "infoURL": "https://bifrost.io/",
  "chainId": 996,
  "networkId": 996
} satisfies Chain