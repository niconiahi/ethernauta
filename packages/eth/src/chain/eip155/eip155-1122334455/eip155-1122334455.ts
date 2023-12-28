/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1122334455 = {
  "name": "IPOS Network",
  "shortName": "ipos",
  "chain": "IPOS",
  "rpc": [
    "https://rpc.iposlab.com",
    "https://rpc2.iposlab.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "IPOS Network Ether",
    "symbol": "IPOS",
    "decimals": 18
  },
  "infoURL": "https://iposlab.com",
  "chainId": 1122334455,
  "networkId": 1122334455
} satisfies Chain