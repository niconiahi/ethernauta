/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_20001 = {
  "name": "Camelark Mainnet",
  "shortName": "Camelark",
  "chain": "ETHW",
  "icon": "camelark",
  "rpc": [
    "https://mainnet-http-rpc.camelark.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EthereumPoW",
    "symbol": "ETHW",
    "decimals": 18
  },
  "infoURL": "https://www.camelark.com",
  "chainId": 20001,
  "networkId": 20001,
  "explorers": [
    {
      "name": "CamelarkScan",
      "url": "https://scan.camelark.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain