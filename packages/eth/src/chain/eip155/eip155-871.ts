/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_871 = {
  "name": "Electra Test Network",
  "shortName": "telc",
  "chain": "Electra",
  "rpc": [
    "https://rpc.testnet.electranetwork.tech"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Test Electra",
    "symbol": "TELC",
    "decimals": 18
  },
  "infoURL": "https://scan.testnet.electranetwork.tech",
  "chainId": 871,
  "networkId": 871,
  "explorers": [
    {
      "name": "Electra Testnet Explorer",
      "url": "https://scan.testnet.electranetwork.tech",
      "standard": "none"
    }
  ]
} satisfies Chain