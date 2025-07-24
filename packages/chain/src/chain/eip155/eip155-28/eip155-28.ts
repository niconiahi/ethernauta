/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_28 = {
  "name": "Boba Network Rinkeby Testnet",
  "shortName": "BobaRinkeby",
  "chain": "ETH",
  "rpc": [
    "https://rinkeby.boba.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "chainId": 28,
  "networkId": 28,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://blockexplorer.rinkeby.boba.network",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://gateway.rinkeby.boba.network"
      }
    ]
  }
} satisfies Chain