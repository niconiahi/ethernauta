/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_13812 = {
  "name": "Susono",
  "shortName": "sus",
  "chain": "SUS",
  "rpc": [
    "https://gateway.opn.network/node/ext/bc/2VsZe5DstWw2bfgdx3YbjKcMsJnNDjni95sZorBEdk9L9Qr9Fr/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Susono",
    "symbol": "OPN",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 13812,
  "networkId": 13812,
  "explorers": [
    {
      "name": "Susono",
      "url": "http://explorer.opn.network",
      "standard": "none"
    }
  ]
} satisfies Chain