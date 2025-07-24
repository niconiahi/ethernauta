/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_112358 = {
  "name": "Metachain One Mainnet",
  "shortName": "metao",
  "chain": "METAO",
  "icon": "metao",
  "rpc": [
    "https://rpc.metachain.one",
    "https://rpc2.metachain.one"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metao",
    "symbol": "METAO",
    "decimals": 18
  },
  "infoURL": "https://metachain.one",
  "chainId": 112358,
  "networkId": 112358,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.metachain.one",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain