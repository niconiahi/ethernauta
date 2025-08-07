/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_247 = {
  "name": "ChooChain",
  "shortName": "choo",
  "title": "ChooChain Mainnet",
  "chain": "CHOO",
  "rpc": [
    "https://rpc.choochain.io"
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
    "name": "ChooChain Token",
    "symbol": "CHOO",
    "decimals": 18
  },
  "infoURL": "https://github.com/Trinketz/ChooChain",
  "chainId": 247,
  "networkId": 247,
  "explorers": [
    {
      "name": "ChooChain Explorer",
      "url": "https://blocks.choochain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain