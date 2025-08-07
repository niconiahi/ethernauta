/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_56797 = {
  "name": "DOID Testnet",
  "shortName": "doidTestnet",
  "chain": "DOID",
  "icon": "doid",
  "rpc": [
    "https://rpc.testnet.doid.tech"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "DOID",
    "symbol": "DOID",
    "decimals": 18
  },
  "infoURL": "https://doid.tech",
  "chainId": 56797,
  "networkId": 56797,
  "explorers": [
    {
      "name": "DOID Testnet Scan",
      "url": "https://scan.testnet.doid.tech",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain