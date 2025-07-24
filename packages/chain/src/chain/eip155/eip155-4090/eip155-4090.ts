/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4090 = {
  "name": "Fastex Chain (Bahamut) Oasis Testnet",
  "shortName": "Oasis",
  "title": "Bahamut testnet Oasis",
  "chain": "Fastex Chain (Bahamut)",
  "icon": "bahamut",
  "rpc": [
    "https://rpc1.oasis.bahamutchain.com"
  ],
  "faucets": [
    "https://faucet.oasis.fastexchain.com"
  ],
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
  "infoURL": "https://fastexchain.com",
  "chainId": 4090,
  "networkId": 4090,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://oasis.ftnscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain