/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_272247 = {
  "name": "Nxy Area 51",
  "shortName": "nxytest",
  "chain": "NXY",
  "rpc": [
    "https://nxy.social/testnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Nxy",
    "symbol": "NXY",
    "decimals": 18
  },
  "infoURL": "https://nxy.social/l1",
  "chainId": 272247,
  "networkId": 272247,
  "slip44": 272247,
  "explorers": [
    {
      "name": "Nxy Explorer",
      "url": "https://explorer.nxy.social",
      "standard": "none"
    }
  ]
} satisfies Chain