/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_23118 = {
  "name": "Opside Testnet",
  "shortName": "opside",
  "chain": "Opside",
  "icon": "opside",
  "rpc": [
    "https://testrpc.opside.network"
  ],
  "faucets": [
    "https://faucet.opside.network"
  ],
  "nativeCurrency": {
    "name": "IDE",
    "symbol": "IDE",
    "decimals": 18
  },
  "infoURL": "https://opside.network",
  "chainId": 23118,
  "networkId": 23118,
  "slip44": 1,
  "explorers": [
    {
      "name": "opsideInfo",
      "url": "https://opside.info",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain