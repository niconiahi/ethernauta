/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_128123 = {
  "name": "Etherlink Testnet",
  "shortName": "etlt",
  "chain": "Etherlink",
  "icon": "etherlink",
  "rpc": [
    "https://node.ghostnet.etherlink.com"
  ],
  "faucets": [
    "https://faucet.etherlink.com"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "tez",
    "symbol": "XTZ",
    "decimals": 18
  },
  "infoURL": "https://etherlink.com",
  "chainId": 128123,
  "networkId": 128123,
  "explorers": [
    {
      "name": "Etherlink Testnet Explorer",
      "url": "https://testnet.explorer.etherlink.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain