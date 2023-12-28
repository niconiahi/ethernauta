/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2718 = {
  "name": "K-LAOS",
  "shortName": "k-laos",
  "title": "K-LAOS: LAOS on Kusama",
  "chain": "K-LAOS",
  "icon": "k-laos",
  "rpc": [
    "https://rpc.klaos.laosfoundation.io",
    "wss://rpc.klaos.laosfoundation.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KLAOS",
    "symbol": "KLAOS",
    "decimals": 18
  },
  "infoURL": "https://www.laosfoundation.io/",
  "chainId": 2718,
  "networkId": 2718,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.klaos.laosfoundation.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain