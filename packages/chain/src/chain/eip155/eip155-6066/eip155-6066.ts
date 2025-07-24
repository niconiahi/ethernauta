/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6066 = {
  "name": "Tres Mainnet",
  "shortName": "TRESMAIN",
  "chain": "TresLeches",
  "icon": "tresleches",
  "rpc": [
    "https://rpc.tresleches.finance/",
    "https://rpc.treschain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TRES",
    "symbol": "TRES",
    "decimals": 18
  },
  "infoURL": "https://treschain.com",
  "chainId": 6066,
  "networkId": 6066,
  "explorers": [
    {
      "name": "treslechesexplorer",
      "url": "https://explorer.tresleches.finance",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain