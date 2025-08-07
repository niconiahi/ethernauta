/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_476462898 = {
  "name": "GPT Testnet",
  "shortName": "Skopje",
  "chain": "Skopje Testnet",
  "icon": "skopje-gpt",
  "rpc": [
    "https://testnet-rpc.gptprotocol.io"
  ],
  "faucets": [
    "https://testnet-faucet.gptprotocol.io"
  ],
  "nativeCurrency": {
    "name": "SkpGPT",
    "symbol": "SkpGPT",
    "decimals": 18
  },
  "infoURL": "https://gptprotocol.com",
  "chainId": 476462898,
  "networkId": 476462898,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.gptprotocol.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://testnet-bridge.gptprotocol.io"
      }
    ]
  }
} satisfies Chain