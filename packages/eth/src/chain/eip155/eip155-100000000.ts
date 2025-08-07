/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_100000000 = {
  "name": "Ethos",
  "shortName": "ETHOS",
  "chain": "ETHOS",
  "icon": "ethos",
  "rpc": [
    "https://rpc.ethos.cool"
  ],
  "faucets": [
    "https://faucet.ethos.cool"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "ETHOS",
    "symbol": "ETHOS",
    "decimals": 18
  },
  "infoURL": "https://ethos.cool",
  "chainId": 100000000,
  "networkId": 100000000,
  "explorers": [
    {
      "name": "ethos scan",
      "url": "https://scan.ethos.cool",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain