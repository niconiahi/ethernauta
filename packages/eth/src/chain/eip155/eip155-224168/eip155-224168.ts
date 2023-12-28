/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_224168 = {
  "name": "Taf ECO Chain Mainnet",
  "shortName": "TAFECO",
  "chain": "Taf ECO Chain",
  "icon": "taf",
  "rpc": [
    "https://mainnet.tafchain.com/v1"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Taf ECO Chain Mainnet",
    "symbol": "TAFECO",
    "decimals": 18
  },
  "infoURL": "https://www.tafchain.com",
  "chainId": 224168,
  "networkId": 224168,
  "explorers": [
    {
      "name": "Taf ECO Chain Mainnet",
      "url": "https://ecoscan.tafchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain