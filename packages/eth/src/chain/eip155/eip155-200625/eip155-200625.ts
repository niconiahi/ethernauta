/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_200625 = {
  "name": "Akroma",
  "shortName": "aka",
  "chain": "AKA",
  "rpc": [
    "https://remote.akroma.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Akroma Ether",
    "symbol": "AKA",
    "decimals": 18
  },
  "infoURL": "https://akroma.io",
  "chainId": 200625,
  "networkId": 200625,
  "slip44": 200625
} satisfies Chain