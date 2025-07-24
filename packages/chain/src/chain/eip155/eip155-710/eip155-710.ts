/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_710 = {
  "name": "Highbury",
  "shortName": "fury",
  "chain": "HIGHBURY",
  "icon": "highbury",
  "rpc": [
    "https://highbury.furya.io",
    "https://rest.furya.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Fury",
    "symbol": "FURY",
    "decimals": 18
  },
  "infoURL": "https://www.fury.black",
  "chainId": 710,
  "networkId": 710,
  "explorers": [
    {
      "name": "Furya EVM Explorer",
      "url": "https://explorer.furya.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain