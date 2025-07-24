/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_424242 = {
  "name": "Fastex Chain testnet",
  "shortName": "fastexTestnet",
  "title": "Fastex Chain testnet",
  "chain": "FTN",
  "rpc": [
    "https://rpc.testnet.fastexchain.com"
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
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "infoURL": "https://fastex.com",
  "chainId": 424242,
  "networkId": 424242,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.ftnscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain