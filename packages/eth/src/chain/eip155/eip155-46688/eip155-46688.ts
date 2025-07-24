/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_46688 = {
  "name": "Fusion Testnet",
  "shortName": "tfsn",
  "chain": "FSN",
  "icon": "fusion",
  "rpc": [
    "https://testnet.fusionnetwork.io",
    "wss://testnet.fusionnetwork.io"
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
    "name": "Testnet Fusion",
    "symbol": "T-FSN",
    "decimals": 18
  },
  "infoURL": "https://fusion.org",
  "chainId": 46688,
  "networkId": 46688,
  "slip44": 1,
  "explorers": [
    {
      "name": "fsnscan",
      "url": "https://testnet.fsnscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain