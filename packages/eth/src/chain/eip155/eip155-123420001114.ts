/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_123420001114 = {
  "name": "Basecamp",
  "shortName": "Basecamp",
  "chain": "CAMP",
  "icon": "camp",
  "rpc": [
    "https://rpc.basecamp.t.raas.gelato.cloud"
  ],
  "faucets": [
    "https://www.campnetwork.xyz/faucet_l1"
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
    "name": "Camp",
    "symbol": "CAMP",
    "decimals": 18
  },
  "infoURL": "https://docs.campnetwork.xyz/",
  "chainId": 123420001114,
  "networkId": 123420001114,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://basecamp.cloud.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain