/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_52225 = {
  "name": "Cytonic Settlement Layer Testnet",
  "shortName": "CSL",
  "chain": "CytonicSL",
  "icon": "cytonic_l1",
  "rpc": [
    "http://rpc.sl.testnet.cytonic.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cytonic",
    "symbol": "CCC",
    "decimals": 18
  },
  "infoURL": "https://cytonic.com",
  "chainId": 52225,
  "networkId": 52225,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sl.testnet.cytonic.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain