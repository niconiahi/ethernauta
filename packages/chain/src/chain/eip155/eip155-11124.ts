/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11124 = {
  "name": "Abstract Sepolia Testnet",
  "shortName": "abstract-sepolia",
  "chain": "Abstract Sepolia Testnet",
  "rpc": [
    "https://api.testnet.abs.xyz"
  ],
  "faucets": [
    "https://faucet.triangleplatform.com/abstract/testnet"
  ],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://abs.xyz/",
  "chainId": 11124,
  "networkId": 11124,
  "explorers": [
    {
      "name": "Abstract Sepolia Testnet Explorer",
      "url": "https://sepolia.abscan.org",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://portal.testnet.abs.xyz/bridge"
      }
    ]
  }
} satisfies Chain