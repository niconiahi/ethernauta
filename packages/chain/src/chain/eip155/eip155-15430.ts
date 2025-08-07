/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_15430 = {
  "name": "KYMTC Mainnet",
  "shortName": "KYMTC",
  "chain": "KYMTC",
  "icon": "kymtc",
  "rpc": [
    "https://mainnet-rpc.kymaticscan.online"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KYMTC",
    "symbol": "KYMTC",
    "decimals": 18
  },
  "infoURL": "https://kymaticscan.online",
  "chainId": 15430,
  "networkId": 15430,
  "explorers": [
    {
      "name": "KYMTC Mainnet Explorer",
      "url": "https://kymaticscan.online",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain