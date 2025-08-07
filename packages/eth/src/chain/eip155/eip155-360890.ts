/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_360890 = {
  "name": "LAVITA Mainnet",
  "shortName": "lavita-mainnet",
  "chain": "LAVITA",
  "icon": "lavita",
  "rpc": [
    "https://tsub360890-eth-rpc.thetatoken.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "vTFUEL",
    "symbol": "vTFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.lavita.ai",
  "chainId": 360890,
  "networkId": 360890,
  "explorers": [
    {
      "name": "LAVITA Mainnet Explorer",
      "url": "https://tsub360890-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain