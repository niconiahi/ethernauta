/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_25839 = {
  "name": "AlveyChain Testnet",
  "shortName": "talv",
  "chain": "tALV",
  "rpc": [
    "https://testnet-rpc.alvey.io"
  ],
  "faucets": [
    "https://faucet.alveytestnet.com"
  ],
  "nativeCurrency": {
    "name": "AlveyCoin Testnet",
    "symbol": "tALV",
    "decimals": 18
  },
  "infoURL": "https://alveychain.com/",
  "chainId": 25839,
  "networkId": 25839,
  "explorers": [
    {
      "name": "AlveyScan Testnet",
      "url": "https://alveytestnet.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain