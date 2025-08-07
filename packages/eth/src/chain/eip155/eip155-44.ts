/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_44 = {
  "name": "Crab Network",
  "shortName": "crab",
  "chain": "crab",
  "rpc": [
    "https://crab-rpc.darwinia.network",
    "https://crab-rpc.dcdao.box"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Crab Network Native Token",
    "symbol": "CRAB",
    "decimals": 18
  },
  "infoURL": "https://crab.network/",
  "chainId": 44,
  "networkId": 44,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://crab-scan.darwinia.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain