/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1115 = {
  "name": "Core Blockchain Testnet",
  "shortName": "tcore",
  "chain": "Core",
  "icon": "core",
  "rpc": [
    "https://rpc.test.btcs.network/"
  ],
  "faucets": [
    "https://scan.test.btcs.network/faucet"
  ],
  "nativeCurrency": {
    "name": "Core Blockchain Testnet Native Token",
    "symbol": "tCORE",
    "decimals": 18
  },
  "infoURL": "https://www.coredao.org",
  "chainId": 1115,
  "networkId": 1115,
  "slip44": 1,
  "explorers": [
    {
      "name": "Core Scan Testnet",
      "url": "https://scan.test.btcs.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain