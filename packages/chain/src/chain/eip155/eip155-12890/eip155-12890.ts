/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12890 = {
  "name": "Quantum Chain Testnet",
  "shortName": "tqnet",
  "chain": "tQNET",
  "icon": "qnet",
  "rpc": [
    "https://testnet-rpc.quantumscan.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quantum Chain",
    "symbol": "tQNET",
    "decimals": 18
  },
  "infoURL": "https://quantumnetwork.gg",
  "chainId": 12890,
  "networkId": 12890,
  "slip44": 1,
  "explorers": [
    {
      "name": "Quantum Scan Testnet",
      "url": "https://testnet.quantumscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain