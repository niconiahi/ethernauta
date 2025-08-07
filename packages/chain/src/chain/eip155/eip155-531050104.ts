/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_531050104 = {
  "name": "Sophon Testnet",
  "shortName": "sophon-testnet",
  "chain": "Sophon Testnet",
  "rpc": [
    "https://rpc.testnet.sophon.xyz",
    "wss://rpc.testnet.sophon.xyz/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sophon",
    "symbol": "SOPH",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 531050104,
  "networkId": 531050104,
  "explorers": [
    {
      "name": "Sophon Block Explorer",
      "url": "https://explorer.testnet.sophon.xyz",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://portal.testnet.sophon.xyz/bridge"
      }
    ]
  }
} satisfies Chain