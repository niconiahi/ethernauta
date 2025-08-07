/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_167000 = {
  "name": "Taiko Alethia",
  "shortName": "tko-mainnet",
  "chain": "ETH",
  "icon": "taiko",
  "rpc": [
    "https://rpc.mainnet.taiko.xyz",
    "https://taiko-rpc.publicnode.com",
    "wss://taiko-rpc.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "chainId": 167000,
  "networkId": 167000,
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://taikoscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "Routescan",
      "url": "https://taikoexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain