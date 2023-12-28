/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4777 = {
  "name": "BlackFort Exchange Network Testnet",
  "shortName": "TBXN",
  "chain": "TBXN",
  "icon": "bxn",
  "rpc": [
    "https://testnet.blackfort.network/rpc"
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
    "name": "BlackFort Testnet Token",
    "symbol": "TBXN",
    "decimals": 18
  },
  "infoURL": "https://blackfort.exchange",
  "chainId": 4777,
  "networkId": 4777,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.blackfort.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain