/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1559 = {
  "name": "Tenet",
  "shortName": "tenet",
  "title": "Tenet Mainnet",
  "chain": "TENET",
  "icon": "tenet",
  "rpc": [
    "https://rpc.tenet.org",
    "https://tenet-evm.publicnode.com",
    "wss://tenet-evm.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TENET",
    "symbol": "TENET",
    "decimals": 18
  },
  "infoURL": "https://tenet.org/",
  "chainId": 1559,
  "networkId": 1559,
  "explorers": [
    {
      "name": "TenetScan Mainnet",
      "url": "https://tenetscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain