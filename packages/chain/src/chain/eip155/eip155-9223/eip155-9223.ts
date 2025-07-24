/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9223 = {
  "name": "Codefin Mainnet",
  "shortName": "COF",
  "chain": "COF",
  "icon": "codefin",
  "rpc": [
    "https://chain-rpc.codefin.pro"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Codefin",
    "symbol": "COF",
    "decimals": 18
  },
  "infoURL": "https://network.codefin.pro",
  "chainId": 9223,
  "networkId": 9223,
  "explorers": [
    {
      "name": "Codefin Net Explorer",
      "url": "https://explorer.codefin.pro",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain