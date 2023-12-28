/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7668 = {
  "name": "The Root Network - Mainnet",
  "shortName": "trn-mainnet",
  "chain": "TRN",
  "rpc": [
    "https://root.rootnet.live/archive",
    "wss://root.rootnet.live/archive/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 6
  },
  "infoURL": "https://www.futureverse.com/technology/root",
  "chainId": 7668,
  "networkId": 7668,
  "explorers": [
    {
      "name": "rootnet",
      "url": "https://explorer.rootnet.live",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain