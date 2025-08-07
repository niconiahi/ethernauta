/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3300 = {
  "name": "Realio Testnet",
  "shortName": "realiotestnet",
  "chain": "Realio Testnet",
  "icon": "realiotestnet",
  "rpc": [
    "https://json-rpc.realiostage.network",
    "https://realio-testnet.json-rpc.decentrio.ventures"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Rio",
    "symbol": "RIO",
    "decimals": 18
  },
  "infoURL": "https://www.realio.network",
  "chainId": 3300,
  "networkId": 3300,
  "explorers": [
    {
      "name": "Realio Testnet Explorer",
      "url": "https://explorer.realiostage.network",
      "standard": "none"
    }
  ]
} satisfies Chain