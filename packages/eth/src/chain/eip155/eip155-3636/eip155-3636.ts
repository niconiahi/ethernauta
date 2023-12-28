/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3636 = {
  "name": "Botanix Testnet",
  "shortName": "BTNX",
  "chain": "BOTANIX",
  "icon": "botanix",
  "rpc": [
    "https://node.botanixlabs.dev"
  ],
  "faucets": [
    "https://faucet.botanixlabs.dev"
  ],
  "nativeCurrency": {
    "name": "Botanix",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://botanixlabs.xyz",
  "chainId": 3636,
  "networkId": 3636,
  "slip44": 1,
  "explorers": [
    {
      "name": "3xpl",
      "url": "https://3xpl.com/botanix",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain