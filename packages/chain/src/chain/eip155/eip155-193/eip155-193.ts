/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_193 = {
  "name": "Crypto Emergency",
  "shortName": "cem",
  "chain": "CEM",
  "rpc": [
    "https://cemchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Crypto Emergency",
    "symbol": "CEM",
    "decimals": 18
  },
  "infoURL": "https://cemblockchain.com/",
  "chainId": 193,
  "networkId": 193,
  "explorers": [
    {
      "name": "cemscan",
      "url": "https://cemscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain