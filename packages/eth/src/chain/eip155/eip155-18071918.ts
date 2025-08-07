/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_18071918 = {
  "name": "Mande Network Mainnet",
  "shortName": "Mande",
  "chain": "Mande",
  "icon": "mande",
  "rpc": [
    "https://mande-mainnet.public.blastapi.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mand",
    "symbol": "MAND",
    "decimals": 18
  },
  "infoURL": "https://mande.network/",
  "chainId": 18071918,
  "networkId": 18071918,
  "explorers": [
    {
      "name": "FYI",
      "url": "https://dym.fyi/r/mande",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain