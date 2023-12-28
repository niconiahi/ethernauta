/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_888 = {
  "name": "Wanchain",
  "shortName": "wan",
  "chain": "WAN",
  "rpc": [
    "https://gwan-ssl.wandevs.org:56891/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "infoURL": "https://www.wanscan.org",
  "chainId": 888,
  "networkId": 888,
  "slip44": 5718350
} satisfies Chain