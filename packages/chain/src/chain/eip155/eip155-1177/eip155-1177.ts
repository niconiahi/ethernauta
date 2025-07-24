/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1177 = {
  "name": "Smart Host Teknoloji TESTNET",
  "shortName": "sht",
  "chain": "SHT",
  "icon": "smarthost",
  "rpc": [
    "https://s2.tl.web.tr:4041"
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
    "name": "Smart Host Teknoloji TESTNET",
    "symbol": "tSHT",
    "decimals": 18
  },
  "infoURL": "https://smart-host.com.tr",
  "chainId": 1177,
  "networkId": 1177,
  "slip44": 1,
  "explorers": [
    {
      "name": "Smart Host Teknoloji TESTNET Explorer",
      "url": "https://s2.tl.web.tr:4000",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain