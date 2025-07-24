/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_800001 = {
  "name": "OctaSpace",
  "shortName": "octa",
  "chain": "OCTA",
  "icon": "octaspace",
  "rpc": [
    "https://rpc.octa.space",
    "wss://rpc.octa.space"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OctaSpace",
    "symbol": "OCTA",
    "decimals": 18
  },
  "infoURL": "https://octa.space",
  "chainId": 800001,
  "networkId": 800001,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.octa.space",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain