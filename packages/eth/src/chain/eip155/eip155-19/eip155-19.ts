/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_19 = {
  "name": "Songbird Canary-Network",
  "shortName": "sgb",
  "chain": "SGB",
  "icon": "songbird",
  "rpc": [
    "https://songbird-api.flare.network/ext/C/rpc",
    "https://sgb.ftso.com.au/ext/bc/C/rpc",
    "https://sgb.lightft.so/rpc",
    "https://sgb-rpc.ftso.eu",
    "https://rpc.ftso.au/songbird"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Songbird",
    "symbol": "SGB",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "chainId": 19,
  "networkId": 19,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://songbird-explorer.flare.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain