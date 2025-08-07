/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_19777 = {
  "name": "Astra Sepolia",
  "shortName": "astra-sepolia",
  "chain": "Astra Sepolia",
  "icon": "astrasepolia",
  "rpc": [
    "https://rpc-astra-9on2f72wzn.t.conduit.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Astra",
    "symbol": "ATX",
    "decimals": 18
  },
  "infoURL": "https://explorer-astra-9on2f72wzn.t.conduit.xyz",
  "chainId": 19777,
  "networkId": 19777,
  "slip44": 1,
  "explorers": [
    {
      "name": "Astra Sepolia Explorer",
      "url": "https://explorer-astra-9on2f72wzn.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain