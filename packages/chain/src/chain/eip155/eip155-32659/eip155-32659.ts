/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_32659 = {
  "name": "Fusion Mainnet",
  "shortName": "fsn",
  "chain": "FSN",
  "icon": "fusion",
  "rpc": [
    "https://mainnet.fusionnetwork.io",
    "wss://mainnet.fusionnetwork.io"
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
    "name": "Fusion",
    "symbol": "FSN",
    "decimals": 18
  },
  "infoURL": "https://fusion.org",
  "chainId": 32659,
  "networkId": 32659,
  "slip44": 288,
  "explorers": [
    {
      "name": "fsnscan",
      "url": "https://fsnscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain