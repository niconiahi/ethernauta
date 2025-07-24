/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_242 = {
  "name": "Plinga Mainnet",
  "shortName": "plgchain",
  "chain": "Plinga",
  "icon": "plinga",
  "rpc": [
    "https://rpcurl.mainnet.plgchain.com",
    "https://rpcurl.plgchain.blockchain.evmnode.online",
    "https://rpcurl.mainnet.plgchain.plinga.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plinga",
    "symbol": "PLINGA",
    "decimals": 18
  },
  "infoURL": "https://www.plinga.technology/",
  "chainId": 242,
  "networkId": 242,
  "explorers": [
    {
      "name": "plgscan",
      "url": "https://www.plgscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain