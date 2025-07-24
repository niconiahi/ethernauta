/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_111000 = {
  "name": "Siberium Test Network",
  "shortName": "testsbr",
  "chain": "SBR",
  "icon": "siberium",
  "rpc": [
    "https://rpc.test.siberium.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TestSIBR",
    "symbol": "SIBR",
    "decimals": 18
  },
  "infoURL": "https://siberium.net",
  "chainId": 111000,
  "networkId": 111000,
  "slip44": 1,
  "explorers": [
    {
      "name": "Siberium Testnet Explorer - blockscout",
      "url": "https://explorer.test.siberium.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain