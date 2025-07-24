/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1003 = {
  "name": "Tectum Emission Token",
  "shortName": "tet",
  "chain": "TET",
  "rpc": [
    "https://rpc.softnote.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tectum",
    "symbol": "TET",
    "decimals": 8
  },
  "infoURL": "https://softnote.com",
  "chainId": 1003,
  "networkId": 1003,
  "explorers": [
    {
      "name": "Tectum explorer",
      "url": "https://explorer.tectum.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain