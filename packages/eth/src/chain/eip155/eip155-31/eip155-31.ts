/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_31 = {
  "name": "Rootstock Testnet",
  "shortName": "trsk",
  "chain": "Rootstock",
  "icon": "rootstock",
  "rpc": [
    "https://public-node.testnet.rsk.co",
    "https://mycrypto.testnet.rsk.co"
  ],
  "faucets": [
    "https://faucet.rsk.co/"
  ],
  "nativeCurrency": {
    "name": "Testnet Smart Bitcoin",
    "symbol": "tRBTC",
    "decimals": 18
  },
  "infoURL": "https://rootstock.io",
  "chainId": 31,
  "networkId": 31,
  "slip44": 1,
  "explorers": [
    {
      "name": "RSK Testnet Explorer",
      "url": "https://explorer.testnet.rsk.co",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain