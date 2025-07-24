/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2613 = {
  "name": "EZChain C-Chain Testnet",
  "shortName": "Fuji-EZChain",
  "chain": "EZC",
  "icon": "ezchain",
  "rpc": [
    "https://testnet-api.ezchain.com/ext/bc/C/rpc"
  ],
  "faucets": [
    "https://testnet-faucet.ezchain.com"
  ],
  "nativeCurrency": {
    "name": "EZChain",
    "symbol": "EZC",
    "decimals": 18
  },
  "infoURL": "https://ezchain.com",
  "chainId": 2613,
  "networkId": 2613,
  "slip44": 1,
  "explorers": [
    {
      "name": "ezchain",
      "url": "https://testnet-cchain-explorer.ezchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain