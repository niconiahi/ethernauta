/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1511670449 = {
  "name": "GPT Mainnet",
  "shortName": "GPT",
  "chain": "GPT Protocol",
  "icon": "gpt",
  "rpc": [
    "https://rpc.gptprotocol.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GPT",
    "symbol": "GPT",
    "decimals": 18
  },
  "infoURL": "https://gptprotocol.com",
  "chainId": 1511670449,
  "networkId": 1511670449,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.gptprotocol.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.gptprotocol.io"
      }
    ]
  }
} satisfies Chain