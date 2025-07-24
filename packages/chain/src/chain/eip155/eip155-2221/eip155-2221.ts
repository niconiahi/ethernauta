/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2221 = {
  "name": "Kava Testnet",
  "shortName": "tkava",
  "chain": "KAVA",
  "icon": "kava",
  "rpc": [
    "https://evm.testnet.kava.io",
    "https://kava-evm-testnet.rpc.thirdweb.com",
    "wss://wevm.testnet.kava.io"
  ],
  "faucets": [
    "https://faucet.kava.io"
  ],
  "nativeCurrency": {
    "name": "TKava",
    "symbol": "TKAVA",
    "decimals": 18
  },
  "infoURL": "https://www.kava.io",
  "chainId": 2221,
  "networkId": 2221,
  "explorers": [
    {
      "name": "Kava Testnet Explorer",
      "url": "http://testnet.kavascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain