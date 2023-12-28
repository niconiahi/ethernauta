/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_56288 = {
  "name": "Boba BNB Mainnet",
  "shortName": "BobaBnb",
  "chain": "Boba BNB Mainnet",
  "rpc": [
    "https://bnb.boba.network",
    "https://boba-bnb.gateway.tenderly.co/",
    "https://gateway.tenderly.co/public/boba-bnb",
    "https://replica.bnb.boba.network",
    "wss://boba-bnb.gateway.tenderly.co/",
    "wss://gateway.tenderly.co/public/boba-bnb"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "chainId": 56288,
  "networkId": 56288,
  "explorers": [
    {
      "name": "Boba BNB block explorer",
      "url": "https://blockexplorer.bnb.boba.network",
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