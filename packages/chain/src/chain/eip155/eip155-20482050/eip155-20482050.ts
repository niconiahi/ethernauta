/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_20482050 = {
  "name": "Hokum Testnet",
  "shortName": "hokum-testnet",
  "chain": "HokumTestnet",
  "icon": "hokum",
  "rpc": [
    "https://testnet.hokum.gg"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://hokum.gg",
  "chainId": 20482050,
  "networkId": 20482050,
  "explorers": [
    {
      "name": "Hokum Explorer",
      "url": "https://testnet-explorer.hokum.gg",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain