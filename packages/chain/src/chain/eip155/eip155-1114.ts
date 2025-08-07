/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1114 = {
  "name": "Core Blockchain Testnet2",
  "shortName": "tcore2",
  "chain": "Core",
  "icon": "core",
  "rpc": [
    "https://rpc.test2.btcs.network/"
  ],
  "faucets": [
    "https://scan.test2.btcs.network/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Core Blockchain Testnet2 Native Token",
    "symbol": "tCORE2",
    "decimals": 18
  },
  "infoURL": "https://www.coredao.org",
  "chainId": 1114,
  "networkId": 1114,
  "slip44": 1,
  "explorers": [
    {
      "name": "Core Scan Testnet2",
      "url": "https://scan.test2.btcs.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain