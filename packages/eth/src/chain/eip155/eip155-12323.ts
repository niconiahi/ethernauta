/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_12323 = {
  "name": "Huddle01 dRTC Chain",
  "shortName": "huddle01",
  "chain": "huddle01",
  "icon": "huddle01",
  "rpc": [
    "https://huddle01.calderachain.xyz/http"
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://huddle01.com/",
  "chainId": 12323,
  "networkId": 12323,
  "explorers": [
    {
      "name": "Huddle01 Caldera Explorer",
      "url": "https://huddle01.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain