/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_12052024 = {
  "name": "Memento Testnet",
  "shortName": "memento-test",
  "chain": "Memento",
  "rpc": [
    "https://test-rpc.mementoblockchain.com/IRkghvI3FfEArEJMr4zC/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 12052024,
  "networkId": 12052024,
  "explorers": [
    {
      "name": "Tracehawk",
      "url": "https://test-explorer.mementoblockchain.com",
      "standard": "none"
    }
  ]
} satisfies Chain