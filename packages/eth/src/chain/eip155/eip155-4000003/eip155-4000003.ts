/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4000003 = {
  "name": "AltLayer Zero Gas Network",
  "shortName": "alt-zerogas",
  "chain": "ETH",
  "icon": "altlayer",
  "rpc": [
    "https://zero.alt.technology"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "infoURL": "https://altlayer.io",
  "chainId": 4000003,
  "networkId": 4000003,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zero-explorer.alt.technology",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain