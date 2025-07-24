/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7100 = {
  "name": "Nume",
  "shortName": "nume",
  "title": "Nume",
  "chain": "Nume",
  "icon": "nume",
  "rpc": [
    "https://rpc.numecrypto.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dai Stablecoin",
    "symbol": "DAI",
    "decimals": 18
  },
  "infoURL": "https://numecrypto.com",
  "chainId": 7100,
  "networkId": 7100,
  "explorers": [
    {
      "name": "numeexplorer",
      "url": "https://explorer.numecrypto.com",
      "standard": "none"
    }
  ]
} satisfies Chain