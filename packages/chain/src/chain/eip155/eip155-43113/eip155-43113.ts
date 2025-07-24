/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_43113 = {
  "name": "Avalanche Fuji Testnet",
  "shortName": "Fuji",
  "chain": "AVAX",
  "icon": "avax",
  "rpc": [
    "https://api.avax-test.network/ext/bc/C/rpc",
    "https://avalanche-fuji-c-chain.publicnode.com",
    "wss://avalanche-fuji-c-chain.publicnode.com"
  ],
  "faucets": [
    "https://faucet.avax-test.network/"
  ],
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "infoURL": "https://cchain.explorer.avax-test.network",
  "chainId": 43113,
  "networkId": 1,
  "slip44": 1,
  "explorers": [
    {
      "name": "snowtrace",
      "url": "https://testnet.snowtrace.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain