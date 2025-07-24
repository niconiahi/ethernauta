/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_156 = {
  "name": "OEBlock Testnet",
  "shortName": "obe",
  "chain": "OEBt",
  "icon": "oescan",
  "rpc": [
    "https://testnet-rpc.oeblock.com"
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
    "name": "OEBlock",
    "symbol": "OEB",
    "decimals": 18
  },
  "infoURL": "https://www.oeblock.com/",
  "chainId": 156,
  "networkId": 156,
  "slip44": 1,
  "explorers": [
    {
      "name": "OEScan explorer",
      "url": "https://testnet.oescan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain