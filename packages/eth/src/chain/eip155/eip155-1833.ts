/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1833 = {
  "name": "Verify testnet",
  "shortName": "verify-testnet",
  "title": "Verify Testnet",
  "chain": "verify-testnet",
  "rpc": [
    "https://rpc.verify-testnet.gelato.digital",
    "wss://ws.verify-testnet.gelato.digital"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Matic",
    "symbol": "MATIC",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/verify-testnet",
  "chainId": 1833,
  "networkId": 1833,
  "slip44": 60,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://verify-testnet.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-80002",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/verify-testnet"
      }
    ]
  }
} satisfies Chain