/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7027 = {
  "name": "Ella the heart",
  "shortName": "ELLA",
  "chain": "ella",
  "icon": "ella",
  "rpc": [
    "https://rpc.ella.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ella",
    "symbol": "ELLA",
    "decimals": 18
  },
  "infoURL": "https://ella.network",
  "chainId": 7027,
  "networkId": 7027,
  "explorers": [
    {
      "name": "Ella",
      "url": "https://ella.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain