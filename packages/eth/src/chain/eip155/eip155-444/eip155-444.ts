/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_444 = {
  "name": "Synapse Chain Testnet",
  "shortName": "synapse-sepolia",
  "chain": "ETH",
  "rpc": [
    "https://sepolia.synapseprotocol.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://synapseprotocol.com",
  "chainId": 444,
  "networkId": 444,
  "slip44": 1,
  "explorers": [
    {
      "name": "Synapse Chain Sepolia",
      "url": "https://sepolia.synapsescan.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://docs.synapseprotocol.com/synapse-chain/using-synapse-chain/bridging-to-synapse-chain"
      }
    ]
  },
  "status": "active",
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain