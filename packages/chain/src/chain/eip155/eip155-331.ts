/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_331 = {
  "name": "Telos zkEVM Testnet",
  "shortName": "telos-zkevm-testnet",
  "title": "Telos zkEVM Testnet",
  "chain": "Telos",
  "icon": "telos",
  "rpc": [
    "https://zkrpc.testnet.telos.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 331,
  "networkId": 331,
  "explorers": [
    {
      "name": "TeloScan",
      "url": "https://zkexplorer.testnet.telos.net",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://zkbridge.testnet.telos.net"
      }
    ]
  }
} satisfies Chain