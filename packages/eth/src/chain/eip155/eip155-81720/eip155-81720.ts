/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_81720 = {
  "name": "Quantum Chain Mainnet",
  "shortName": "qnet",
  "chain": "QNET",
  "icon": "qnet",
  "rpc": [
    "https://rpc.quantumscan.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quantum Chain",
    "symbol": "QNET",
    "decimals": 18
  },
  "infoURL": "https://quantumnetwork.gg",
  "chainId": 81720,
  "networkId": 81720,
  "explorers": [
    {
      "name": "Quantum Scan Mainnet",
      "url": "https://quantumscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain