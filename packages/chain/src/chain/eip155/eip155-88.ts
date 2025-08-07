/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_88 = {
  "name": "Viction",
  "shortName": "vic",
  "chain": "Viction",
  "rpc": [
    "https://rpc.viction.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Viction",
    "symbol": "VIC",
    "decimals": 18
  },
  "infoURL": "https://viction.xyz",
  "chainId": 88,
  "networkId": 88,
  "slip44": 889
} satisfies Chain