/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8655 = {
  "name": "Toki Testnet",
  "shortName": "toki-testnet",
  "chain": "TOKI",
  "icon": "toki",
  "rpc": [
    "https://testnet.buildwithtoki.com/v0/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Toki",
    "symbol": "TOKI",
    "decimals": 18
  },
  "infoURL": "https://www.buildwithtoki.com",
  "chainId": 8655,
  "networkId": 8655,
  "slip44": 1,
  "explorers": []
} satisfies Chain