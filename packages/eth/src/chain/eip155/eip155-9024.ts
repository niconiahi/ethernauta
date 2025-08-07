/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9024 = {
  "name": "Nexa Testnet Block",
  "shortName": "NexaTestnet",
  "chain": "Nexa Testnet",
  "icon": "nexaChain",
  "rpc": [
    "https://rpc-testnet-nodes.nexablockscan.io"
  ],
  "faucets": [
    "https://testnet.nexablockscan.io/faucet"
  ],
  "nativeCurrency": {
    "name": "Nexa Testnet Token",
    "symbol": "NEXB",
    "decimals": 18
  },
  "infoURL": "https://www.nexablock.io",
  "chainId": 9024,
  "networkId": 9024,
  "explorers": [
    {
      "name": "Nexablock Testnet Explorer",
      "url": "https://testnet.nexablockscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain