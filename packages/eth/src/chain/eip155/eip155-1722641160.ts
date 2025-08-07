/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1722641160 = {
  "name": "Silicon zkEVM Sepolia Testnet",
  "shortName": "silicon-sepolia-testnet",
  "title": "Silicon zkEVM Sepolia Testnet",
  "chain": "Silicon",
  "icon": "silicon",
  "rpc": [
    "https://rpc-sepolia.silicon.network",
    "https://silicon-testnet.nodeinfra.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://docs.silicon.network",
  "chainId": 1722641160,
  "networkId": 1722641160,
  "explorers": [
    {
      "name": "siliconscope-sepolia",
      "url": "https://scope-sepolia.silicon.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge-sepolia.silicon.network"
      }
    ]
  },
  "status": "active"
} satisfies Chain