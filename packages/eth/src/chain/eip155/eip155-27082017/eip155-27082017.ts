/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_27082017 = {
  "name": "Excoincial Chain Volta-Testnet",
  "shortName": "exlvolta",
  "chain": "TEXL",
  "icon": "exl",
  "rpc": [
    "https://testnet-rpc.exlscan.com"
  ],
  "faucets": [
    "https://faucet.exlscan.com"
  ],
  "nativeCurrency": {
    "name": "TExlcoin",
    "symbol": "TEXL",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 27082017,
  "networkId": 27082017,
  "slip44": 1,
  "explorers": [
    {
      "name": "exlscan",
      "url": "https://testnet-explorer.exlscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain