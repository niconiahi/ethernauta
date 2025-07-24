/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5005 = {
  "name": "Treasurenet Testnet",
  "shortName": "tntest",
  "chain": "Treasurenet Testnet",
  "icon": "treasurenet",
  "rpc": [
    "https://node0.testnet.treasurenet.io",
    "https://node1.testnet.treasurenet.io",
    "https://node2.testnet.treasurenet.io",
    "https://node3.testnet.treasurenet.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "UNIT",
    "symbol": "UNIT",
    "decimals": 18
  },
  "infoURL": "https://www.testnet.treasurenet.io",
  "chainId": 5005,
  "networkId": 5005,
  "slip44": 1,
  "explorers": [
    {
      "name": "Treasurenet EVM BlockExplorer",
      "url": "https://evmexplorer.testnet.treasurenet.io",
      "standard": "none"
    }
  ]
} satisfies Chain