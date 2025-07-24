/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_20 = {
  "name": "Elastos Smart Chain",
  "shortName": "esc",
  "chain": "ETH",
  "rpc": [
    "https://api.elastos.io/eth"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "ELA",
    "decimals": 18
  },
  "infoURL": "https://www.elastos.org/",
  "chainId": 20,
  "networkId": 20,
  "explorers": [
    {
      "name": "elastos esc explorer",
      "url": "https://esc.elastos.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain