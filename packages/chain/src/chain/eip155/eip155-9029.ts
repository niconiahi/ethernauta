/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9029 = {
  "name": "Qubetics Testnet",
  "shortName": "Qubetics",
  "chain": "Qubetics Testnet",
  "icon": "qubetics",
  "rpc": [
    "https://rpc-testnet.qubetics.work/"
  ],
  "faucets": [
    "https://testnet.qubetics.work/faucet"
  ],
  "nativeCurrency": {
    "name": "Qubetics Testnet Token",
    "symbol": "TICS",
    "decimals": 18
  },
  "infoURL": "https://www.qubetics.com/",
  "chainId": 9029,
  "networkId": 9029,
  "explorers": [
    {
      "name": "Qubetics Testnet Explorer",
      "url": "https://testnet.qubetics.work",
      "standard": "none"
    }
  ]
} satisfies Chain