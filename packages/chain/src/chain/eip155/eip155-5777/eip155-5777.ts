/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5777 = {
  "name": "Ganache",
  "shortName": "ggui",
  "title": "Ganache GUI Ethereum Testnet",
  "chain": "ETH",
  "icon": "ganache",
  "rpc": [
    "https://127.0.0.1:7545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ganache Test Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://trufflesuite.com/ganache/",
  "chainId": 5777,
  "networkId": 5777,
  "slip44": 1,
  "explorers": []
} satisfies Chain