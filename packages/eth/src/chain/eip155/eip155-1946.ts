/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1946 = {
  "name": "Soneium Testnet Minato",
  "shortName": "soneium-minato",
  "title": "Soneium Testnet Minato",
  "chain": "ETH",
  "icon": "minato",
  "rpc": [
    "https://rpc.minato.soneium.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://soneium.org",
  "chainId": 1946,
  "networkId": 1946,
  "explorers": [
    {
      "name": "Blockscout Minato explorer",
      "url": "https://soneium-minato.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.soneium.org/testnet"
      }
    ]
  }
} satisfies Chain