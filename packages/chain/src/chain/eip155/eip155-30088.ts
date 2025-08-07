/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_30088 = {
  "name": "MiYou Mainnet",
  "shortName": "MiYou",
  "chain": "MiYou Chain",
  "icon": "miyou",
  "rpc": [
    "https://blockchain.miyou.io",
    "https://blockchain.miyoulab.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Miyou",
    "symbol": "MY",
    "decimals": 18
  },
  "infoURL": "https://www.miyou.io",
  "chainId": 30088,
  "networkId": 30088,
  "slip44": 60,
  "ens": {
    "registry": "0xFEfa9B3061435977424DD947E756566cFB60473E"
  },
  "explorers": [
    {
      "name": "MiYou block explorer",
      "url": "https://myscan.miyou.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain