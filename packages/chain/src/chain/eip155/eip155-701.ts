/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_701 = {
  "name": "Darwinia Koi Testnet",
  "shortName": "darwinia-koi",
  "chain": "Darwinia Koi",
  "rpc": [
    "https://koi-rpc.darwinia.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Koi Network Native Token",
    "symbol": "KRING",
    "decimals": 18
  },
  "infoURL": "https://darwinia.network/",
  "chainId": 701,
  "networkId": 701,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://koi-scan.darwinia.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain