/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4328 = {
  "name": "Bobafuji Testnet",
  "shortName": "BobaFujiTestnet",
  "chain": "Bobafuji Testnet",
  "rpc": [
    "https://testnet.avax.boba.network",
    "wss://wss.testnet.avax.boba.network",
    "https://replica.testnet.avax.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "chainId": 4328,
  "networkId": 4328,
  "slip44": 1,
  "explorers": [
    {
      "name": "Bobafuji Testnet block explorer",
      "url": "https://blockexplorer.testnet.avax.boba.network",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://gateway.boba.network"
      }
    ]
  }
} satisfies Chain