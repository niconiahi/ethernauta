/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_254 = {
  "name": "Swan Chain Mainnet",
  "shortName": "Swan",
  "chain": "SWAN",
  "icon": "swan",
  "rpc": [
    "https://mainnet-rpc.swanchain.org",
    "https://mainnet-rpc-01.swanchain.org",
    "https://mainnet-rpc-02.swanchain.org",
    "https://mainnet-rpc-03.swanchain.org",
    "https://mainnet-rpc-04.swanchain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://swanchain.io/",
  "chainId": 254,
  "networkId": 254,
  "explorers": [
    {
      "name": "Swanchain Explorer",
      "url": "https://swanscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain