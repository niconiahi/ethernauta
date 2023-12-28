/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8194 = {
  "name": "Torus Testnet",
  "shortName": "ttqf",
  "chain": "TQF",
  "icon": "torus",
  "rpc": [
    "https://rpc.testnet.toruschain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "tTQF",
    "symbol": "TTQF",
    "decimals": 18
  },
  "infoURL": "https://docs.toruschain.com",
  "chainId": 8194,
  "networkId": 8194,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.toruscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain