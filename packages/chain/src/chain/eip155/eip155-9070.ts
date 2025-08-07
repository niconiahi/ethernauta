/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9070 = {
  "name": "Apex Fusion - Nexus testnet",
  "shortName": "tAP3X",
  "chain": "Nexus testnet",
  "icon": "apexfusion",
  "rpc": [
    "https://rpc.nexus.testnet.apexfusion.org/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Apex Fusion Token",
    "symbol": "tAP3X",
    "decimals": 18
  },
  "infoURL": "https://apexfusion.org/",
  "chainId": 9070,
  "networkId": 9070,
  "explorers": [
    {
      "name": "apexfusion",
      "url": "https://explorer.nexus.testnet.apexfusion.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain