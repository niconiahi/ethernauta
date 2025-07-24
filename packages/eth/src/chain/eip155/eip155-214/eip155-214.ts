/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_214 = {
  "name": "Shinarium Mainnet",
  "shortName": "shinarium",
  "chain": "Shinarium",
  "icon": "shinarium",
  "rpc": [
    "https://mainnet.shinarium.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shina Inu",
    "symbol": "SHI",
    "decimals": 18
  },
  "infoURL": "https://shinarium.org",
  "chainId": 214,
  "networkId": 214,
  "explorers": [
    {
      "name": "shinascan",
      "url": "https://shinascan.shinarium.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain