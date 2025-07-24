/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_14 = {
  "name": "Flare Mainnet",
  "shortName": "flr",
  "chain": "FLR",
  "icon": "flare",
  "rpc": [
    "https://flare-api.flare.network/ext/C/rpc",
    "https://flare.public-rpc.com",
    "https://rpc.ftso.au/flare"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Flare",
    "symbol": "FLR",
    "decimals": 18
  },
  "infoURL": "https://flare.network",
  "chainId": 14,
  "networkId": 14,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://flare-explorer.flare.network",
      "standard": "EIP3091"
    },
    {
      "name": "flarescan",
      "url": "https://flarescan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain