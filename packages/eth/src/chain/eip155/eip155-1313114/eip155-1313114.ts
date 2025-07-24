/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1313114 = {
  "name": "Etho Protocol",
  "shortName": "etho",
  "chain": "ETHO",
  "rpc": [
    "https://rpc.ethoprotocol.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Etho Protocol",
    "symbol": "ETHO",
    "decimals": 18
  },
  "infoURL": "https://ethoprotocol.com",
  "chainId": 1313114,
  "networkId": 1313114,
  "slip44": 1313114,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.ethoprotocol.com",
      "standard": "none"
    }
  ]
} satisfies Chain