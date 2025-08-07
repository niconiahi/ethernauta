/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_25186 = {
  "name": "LiquidLayer Mainnet",
  "shortName": "LILA",
  "chain": "LiquidLayer",
  "icon": "lila",
  "rpc": [
    "https://mainnet.liquidlayer.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LiquidLayer",
    "symbol": "LILA",
    "decimals": 18
  },
  "infoURL": "https://scan.liquidlayer.network",
  "chainId": 25186,
  "networkId": 25186,
  "explorers": [
    {
      "name": "LiquidLayer Mainnet Explorer",
      "url": "https://scan.liquidlayer.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain