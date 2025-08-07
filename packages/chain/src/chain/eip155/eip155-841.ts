/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_841 = {
  "name": "Taraxa Mainnet",
  "shortName": "tara",
  "chain": "TARA",
  "icon": "taraxa",
  "rpc": [
    "https://rpc.mainnet.taraxa.io/",
    "https://ws.mainnet.taraxa.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tara",
    "symbol": "TARA",
    "decimals": 18
  },
  "infoURL": "https://taraxa.io",
  "chainId": 841,
  "networkId": 841,
  "slip44": 726,
  "explorers": [
    {
      "name": "Tara.to Explorer",
      "url": "https://tara.to",
      "standard": "EIP3091"
    },
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.mainnet.taraxa.io",
      "standard": "none"
    }
  ]
} satisfies Chain