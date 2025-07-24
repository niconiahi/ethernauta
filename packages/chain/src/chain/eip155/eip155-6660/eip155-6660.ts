/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6660 = {
  "name": "Latest Chain Testnet",
  "shortName": "LATESTt",
  "chain": "LATEST",
  "icon": "latestChain",
  "rpc": [
    "https://testnet-rpc.latestcoin.io"
  ],
  "faucets": [
    "http://faucet.latestchain.io"
  ],
  "nativeCurrency": {
    "name": "Latest",
    "symbol": "LATEST",
    "decimals": 18
  },
  "infoURL": "https://latestcoin.io",
  "chainId": 6660,
  "networkId": 6660,
  "explorers": [
    {
      "name": "Latest Chain",
      "url": "http://testnet.latestchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain