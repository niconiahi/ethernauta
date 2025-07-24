/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_25925 = {
  "name": "Bitkub Chain Testnet",
  "shortName": "bkct",
  "chain": "BKC",
  "icon": "bkc",
  "rpc": [
    "https://rpc-testnet.bitkubchain.io",
    "wss://wss-testnet.bitkubchain.io"
  ],
  "faucets": [
    "https://faucet.bitkubchain.com"
  ],
  "nativeCurrency": {
    "name": "Bitkub Coin",
    "symbol": "tKUB",
    "decimals": 18
  },
  "infoURL": "https://www.bitkubchain.com/",
  "chainId": 25925,
  "networkId": 25925,
  "slip44": 1,
  "explorers": [
    {
      "name": "bkcscan-testnet",
      "url": "https://testnet.bkcscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain