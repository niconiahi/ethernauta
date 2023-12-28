/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8654 = {
  "name": "Toki Network",
  "shortName": "toki",
  "chain": "TOKI",
  "icon": "toki",
  "rpc": [
    "https://mainnet.buildwithtoki.com/v0/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Toki",
    "symbol": "TOKI",
    "decimals": 18
  },
  "infoURL": "https://www.buildwithtoki.com",
  "chainId": 8654,
  "networkId": 8654,
  "explorers": []
} satisfies Chain