/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_842 = {
  "name": "Taraxa Testnet",
  "shortName": "taratest",
  "chain": "TARA",
  "icon": "taraxa",
  "rpc": [
    "https://rpc.testnet.taraxa.io/",
    "https://ws.testnet.taraxa.io"
  ],
  "faucets": [
    "https://explorer.testnet.taraxa.io/faucet"
  ],
  "nativeCurrency": {
    "name": "Tara",
    "symbol": "TARA",
    "decimals": 18
  },
  "infoURL": "https://taraxa.io",
  "chainId": 842,
  "networkId": 842,
  "slip44": 1,
  "explorers": [
    {
      "name": "Tara.to Explorer",
      "url": "https://testnet.to",
      "standard": "EIP3091"
    },
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.testnet.taraxa.io",
      "standard": "none"
    }
  ]
} satisfies Chain