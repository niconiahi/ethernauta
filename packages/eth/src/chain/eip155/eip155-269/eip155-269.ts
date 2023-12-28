/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_269 = {
  "name": "High Performance Blockchain",
  "shortName": "hpb",
  "chain": "HPB",
  "rpc": [
    "https://hpbnode.com",
    "wss://ws.hpbnode.com"
  ],
  "faucets": [
    "https://myhpbwallet.com/"
  ],
  "nativeCurrency": {
    "name": "High Performance Blockchain Ether",
    "symbol": "HPB",
    "decimals": 18
  },
  "infoURL": "https://hpb.io",
  "chainId": 269,
  "networkId": 269,
  "slip44": 269,
  "explorers": [
    {
      "name": "hscan",
      "url": "https://hscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain