/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_666666666 = {
  "name": "Degen Chain",
  "shortName": "degen-chain",
  "title": "Degen Chain",
  "chain": "Degen",
  "icon": "degen",
  "rpc": [
    "https://rpc.degen.tips"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DEGEN",
    "symbol": "DEGEN",
    "decimals": 18
  },
  "infoURL": "https://degen.tips",
  "chainId": 666666666,
  "networkId": 666666666,
  "status": "incubating"
} satisfies Chain