/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10888 = {
  "name": "GameSwift Chain Testnet",
  "shortName": "gameswift-chain-testnet",
  "title": "GameSwift Chain Testnet",
  "chain": "gameswift-chain-testnet",
  "rpc": [
    "https://rpc-testnet.gameswift.io",
    "wss://ws-testnet.gameswift.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TGameSwift",
    "symbol": "tGS",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/gameswift-chain-testnet",
  "chainId": 10888,
  "networkId": 10888,
  "slip44": 60,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.gameswift.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://testnet-bridge-gelato.gameswift.io/bridge/gameswift-chain-testnet"
      }
    ]
  }
} satisfies Chain